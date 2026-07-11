import { getUserAccounts } from '@/actions/dashboard';
import { defaultCategories } from '@/data/categories';
import React from 'react'
import AddTransactionForm from '../_components/transaction-form';
import { getTransaction } from '@/actions/transaction';

const addTransactionPage = async({ searchParams }) => {
    const accounts = await getUserAccounts();
    const params = await searchParams;

    const editId = params?.edit;

    let initialData = null;
    if(editId){
        const transaction = await getTransaction(editId);
        initialData = transaction;
    }
    return (
        <div className= "max-w-3xl mx-auto px-5">
            <h1 className="text-3xl gradient-title mb-8">{editId?"Edit":"Add"} Transaction</h1>
            <AddTransactionForm 
                accounts = {accounts}
                categories = {defaultCategories}
                editMode = {!!editId}
                initialData = {initialData}
            />

        </div>
    )
};

export default addTransactionPage