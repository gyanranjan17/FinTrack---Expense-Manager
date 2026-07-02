import { getAccountWithTransactions } from '@/actions/account'
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import TransactionTable from '../_components/transaction-table';
import { BarLoader } from 'react-spinners';

const AccountsPage = async ({params}) => {
    const { id } = await params;
    const accountData = await getAccountWithTransactions(id);
    
    if(!accountData){
        notFound();
    }
    const {transactions, ...account} = accountData;
    return (
        <div className = "space-y-8 px-5">
            <div className = "flex gap-4 items-end justify-between">
                <div>
                    <h1 className = "text-3xl sm:text-4xl font-bold capitalize text-sky-800">{account.name}</h1>
                    <p className="text-muted-foreground">{account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account</p>
                </div>

                <div className="text-right pb-2">
                    <div className= "text-xl sm:text-2xl font-bold text-sky-700">
                        ₹{parseFloat(account.balance).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                        <p className="text-sm text-muted-foreground">{account._count.transactions} Transactions</p>
                    </div>
                </div>
            </div>
            
            {/* Chart Section */}

            {/* Transaction Table */}
            <Suspense 
                fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea"/>}
            >
                <TransactionTable transactions = {transactions}/>
            </Suspense>
        </div>
    )
}

export default AccountsPage;