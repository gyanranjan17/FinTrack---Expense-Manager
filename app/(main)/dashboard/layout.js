import React, { Suspense } from 'react'
import DashboardPage from './page';
import { BarLoader } from 'react-spinners';

const DashboardLayout = () => {
  return (
    <div className='px-5 mb-8'>
      <h1 className="text-4xl font-bold gradient-title">
          Dashboard
      </h1>

      <p className="mt-2 text-sm text-slate-500 mb-8">
          Track your accounts, transactions, and financial insights.
      </p>
        <Suspense 
            fallback={<BarLoader className = "mt-4" width={"100%"} color="#9333ea" />}
        >
            <DashboardPage/>
        </Suspense>
    </div>
    
  )
}

export default DashboardLayout;