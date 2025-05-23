import React, { useEffect } from 'react'
import { FaRegCircleUser } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import ROLE from '../common/role'

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()

    useEffect(()=>{
      if(user?.role !== ROLE.ADMIN){
        navigate("/")
      }
    },[user])

  return (
    <div className='min-h-[calc(100vh-100px)] md:flex hidden'>
       <aside className='bg-white min-h-full w-full max-w-60'>
        <div className='h-40 flex justify-center items-center flex-col'>
             <div className='text-5xl cursor-pointer relative flex justify-center '>
                    {
                        user?.profilePic ? (
                            <img src={user?.profilePic} className='w-20 h-20 rounded-full' alt={user?.name} />
                        ) : (
                            <FaRegCircleUser/>
                        )
                    }        
                </div>
                <p className='capitalize text-lg font-semibold'>{user?.name}</p>
                <p className='text-sm'>{user?.role}</p>
        </div>

                {/**navigation*/}
              <div>
                  <nav className='grid p-4'>
                    {/* <Link to={"all-users"} className='px-2 py-1 hover:bg-slate-100'>All Users</Link> */}
                    <Link to={"admins"} className='px-2 py-1 hover:bg-slate-100'>Admins</Link>
                    <Link to={"developers"} className='px-2 py-1 hover:bg-slate-100'>Developers</Link>
                    <Link to={"partners"} className='px-2 py-1 hover:bg-slate-100'>Partners</Link>
                    <Link to={"customers"} className='px-2 py-1 hover:bg-slate-100'>Customers</Link>
                    <Link to={"admin-settings"} className='px-2 py-1 hover:bg-slate-100'>Admin Settings</Link>
                    <Link to={"order-approval"} className='px-2 py-1 hover:bg-slate-100'>Admin Order Approve</Link>
                    <Link to={"admin-tickets"} className='px-2 py-1 hover:bg-slate-100'>Admin Pending Tickets</Link>
                    <Link to={"payment-verification"} className='px-2 py-1 hover:bg-slate-100'>Admin Payment Verification</Link>
                    <Link to={"coupon-management"} className='px-2 py-1 hover:bg-slate-100'>Coupon Management</Link>
                    <Link to={"welcome-content"} className='px-2 py-1 hover:bg-slate-100'>Welcome Content</Link>
                    <Link to={"update-requests"} className='px-2 py-1 hover:bg-slate-100'>Website Update Requests</Link>
                    <Link to={"projects"} className='px-2 py-1 hover:bg-slate-100'>Website Projects</Link>
                    <Link to={"website-updates"} className='px-2 py-1 hover:bg-slate-100'>Website Update Plan</Link>
                    <Link to={"all-developers"} className='px-2 py-1 hover:bg-slate-100'>All Developers</Link>
                    <Link to={"all-ads"} className='px-2 py-1 hover:bg-slate-100'>All Banner Ads</Link>
                    <Link to={"all-categories"} className='px-2 py-1 hover:bg-slate-100'>All Services</Link>
                    <Link to={"all-products"} className='px-2 py-1 hover:bg-slate-100'>All Products</Link>
                    <Link to={"all-orders"} className='px-2 py-1 hover:bg-slate-100'>All Orders</Link>
                    <Link to={"wallet-management"} className='px-2 py-1 hover:bg-slate-100'>Wallet Management</Link>
                  </nav>
              </div>
      </aside>

      <main className='w-full h-full p-2'>
        <Outlet/>
      </main>
    </div>
  )
}

export default AdminPanel
