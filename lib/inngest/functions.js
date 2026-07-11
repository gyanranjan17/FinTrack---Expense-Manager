// src/inngest/functions.ts
import { sendEmail } from "@/actions/send-email";
import { db } from "../prisma";
import { inngest } from "./client";
import EmailTemplate from "@/emails/template";

export const checkBudgetAlert = inngest.createFunction(
  {
    id: "check-budget-alerts",
    name: "Check Budget Alerts",
    triggers: [
      {
        cron: "0 */6 * * *",
      },
    ],
  },
  async ({step}) => {
    const budgets = await step.run("fetch-budget", async()=> {
      return await db.budget.findMany({
        include:{
          user:{
            include:{
              accounts:{
                where:{
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    for(const budget of budgets){
        const defaultAccount = budget.user.accounts[0];
        if(!defaultAccount) continue;

        await step.run(`check-budget-${budget.id}`, async ()=>{
          const currentDate = new Date();
          const startOfMonth = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              1
          );

          const endOfMonth = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth()+1,
              0
          );

          const expenses = await db.transaction.aggregate({
            where:{
              userId: budget.userId,
              accountId: defaultAccount.id,
              type:"EXPENSE",
              date:{
                gte:startOfMonth,
                lte: endOfMonth,
              },
            },
            _sum:{
              amount:true,
            }
          });

          const totalExpenses = expenses._sum.amount?.toNumber() || 0;
          const budgetAmount = budget.amount;
          const percentageUsed = (totalExpenses/budgetAmount)* 100;

          if(percentageUsed >=80 && (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent),new Date()))){
              await sendEmail({
                to: budget.user.email,
                subject: `Budget Alert for ${defaultAccount.name}`,
                react: EmailTemplate({
                  userName: budget.user.name,
                  type: "budget-alert",
                  data: {
                    percentageUsed,
                    budgetAmount: parseInt(budgetAmount).toFixed(1),
                    totalExpenses: parseInt(totalExpenses).toFixed(1),
                    accountName: defaultAccount.name,
                  },
                }),
              });

              await db.budget.update({
                where:{id: budget.id},
                data: {lastAlertSent: new Date()}
              });
          }

        });
    }
  },
);

function isNewMonth(lastAlertDate, currentDate){
  return(
    lastAlertDate.getMonth() !== currentDate.getMonth() || lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}

export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions", // Unique ID,
    name: "Trigger Recurring Transactions",
    triggers: [{ cron: "0 0 * * *" }], // Daily at midnight
  },
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              {
                nextRecurrence: {
                  lte: new Date(),
                },
              },
            ],
          },
        });
      }
    );

    // Send event for each recurring transaction in batches
    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: {
          transactionId: transaction.id,
          userId: transaction.userId,
        },
      }));

      // Send events directly using inngest.send()
      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  }
);

export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10, // Process 10 transactions
      period: "1m", // per minute
      key: "event.data.userId", // Throttle per user
    },
    triggers: [{ event: "transaction.recurring.process" }],
  },
  async ({ event, step }) => {
    // Validate event data
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: {
          account: true,
        },
      });

      if (!transaction || !isTransactionDue(transaction)) return;

      // Create new transaction and update account balance in a transaction
      const recurrenceBase = transaction.nextRecurrence ?? transaction.date;

      await db.$transaction(async (tx) => {
        // Create new transaction
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(recurrenceBase),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });

        // Update account balance
        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });

        // Update last processed date and next recurring date
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurrence: calculateNextRecurringDate(
              recurrenceBase,
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);

function isTransactionDue(transaction) {
  // If no lastProcessed date, transaction is due
  if (!transaction.lastProcessed) return true;

  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);

  // Compare with nextDue date
  return nextDue <= today;
}

function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}