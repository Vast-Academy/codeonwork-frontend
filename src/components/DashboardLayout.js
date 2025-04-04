// src/components/DashboardLayout.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, ShoppingBag, UserCircle, Wallet, MessageSquare, LogOut,
  Search, Bell, ChevronDown, User,
  FileText
} from 'lucide-react';

const DashboardLayout = ({ children, user, walletBalance, cartCount, isLoading, activeProject }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Check if the path is active
  const isActive = (path) => {
    if (path === '/dashboard' && currentPath === '/dashboard') return true;
    if (path !== '/dashboard' && currentPath.startsWith(path)) return true;
    return false;
  };

  // Get the page title based on current path
  const getPageTitle = () => {
    if (currentPath.startsWith('/dashboard')) return 'Dashboard';
    if (currentPath.startsWith('/order')) return 'Your Orders';
    if (currentPath.startsWith('/project-details')) return 'Your Project';
    if (currentPath.startsWith('/profile')) return 'Account Details';
    if (currentPath.startsWith('/wallet')) return 'Wallet Details';
    if (currentPath.startsWith('/support')) return 'Contact Support';
    return 'Dashboard';
  };

  const getProjectLink = () => {
    // If activeProject is provided and has an _id, use it
    if (activeProject && activeProject._id) {
      return `/project-details/${activeProject._id}`;
    }
    
    // If user is already on a project details page, keep them on that project
    if (currentPath.startsWith('/project-details/')) {
      return currentPath;
    }
    
    // Otherwise, redirect to orders page where they can select a project
    return '/order';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-full p-4 flex flex-col">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Only visible on desktop */}
      <aside className="hidden lg:block lg:w-64 bg-white border-r shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
          <h1 className="mr-2 text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
          </div>
        </div>
        
        <div className="py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase">Main Menu</div>
          <ul>
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center px-4 py-3 ${
                  isActive('/dashboard') 
                    ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home size={20} className="mr-3" />
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/order" 
                className={`flex items-center px-4 py-3 ${
                  isActive('/order') 
                    ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShoppingBag size={20} className="mr-3" />
                <span className="font-medium">Your Orders</span>
              </Link>
            </li>
            <li>
              <Link 
                 to={getProjectLink()} 
                className={`flex items-center px-4 py-3 ${
                  isActive('/project-details') 
                    ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText size={20} className="mr-3" />
                <span className="font-medium">Your Project</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className={`flex items-center px-4 py-3 ${
                  isActive('/profile') 
                    ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserCircle size={20} className="mr-3" />
                <span className="font-medium">Account</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/wallet" 
                className={`flex items-center px-4 py-3 ${
                  isActive('/wallet') 
                    ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Wallet size={20} className="mr-3" />
                <span className="font-medium">Wallet</span>
              </Link>
            </li>
          </ul>
          
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase">Help & Support</div>
          <ul>
            <li>
              <Link 
                to="/support" 
                className={`flex items-center px-4 py-3 ${
                  isActive('/support') 
                    ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageSquare size={20} className="mr-3" />
                <span className="font-medium">Contact Support</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mt-auto border-t p-4">
          <Link to="/logout" className="flex items-center text-red-600 hover:text-red-700">
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar - Only visible on desktop */}
        {/* <header className="hidden lg:block bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-3">
            <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 py-2 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="absolute right-3 top-2.5 text-gray-400">
                  <Search size={18} />
                </div>
              </div>
              
              <div className="relative">
                <Link 
                  to="/notifications" 
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-2 cursor-pointer">
                <Link to="/profile" className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    {user?.profilePic ? (
                      <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{user?.name || 'User'}</div>
                    <div className="text-xs text-gray-500">Premium Client</div>
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </Link>
              </div>
            </div>
          </div>
        </header> */}
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;