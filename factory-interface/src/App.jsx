import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Auth, Buy, Categories, Customers, Expense, Home, Income, Items, Production, Profile, Sales, 
  Suppliers, Transactions, Units, Invoices, 
  ProInvoices} from './pages';

import Headers from './components/shared/Headers';
import { useSelector } from 'react-redux';
import useLoadData from './hooks/useLoadData';
import FullScreenLoader from './components/shared/FullScreenLoader';
import { ToastContainer } from 'react-toastify';
import Products from './pages/Products';

function Layout() {

  const location = useLocation();
  const isLoading = useLoadData();
  const hideHeaderRoutes = ['/auth' , '/financials', '/expenses', '/incomes', '/categories', '/products', '/units',
      '/items' , '/sales', '/customers', '/suppliers', '/production', '/purchases', '/invoices' , '/proinvoices', '/profile'
  ];
  
  // to prevent browser with out login
    const { isAuth } = useSelector(state => state.user);
    if(isLoading) return <FullScreenLoader />

  
  return (
    <>
       {!hideHeaderRoutes.includes(location.pathname) && <Headers />}

      <ToastContainer />

      <Routes>

        <Route path='/' element ={ <ProtectedRoutes><Home /></ProtectedRoutes> } />
        <Route path='/profile' element ={<ProtectedRoutes><Profile/></ProtectedRoutes>} />
        <Route path='/financials' element ={<ProtectedRoutes><Transactions/></ProtectedRoutes>} />
        <Route path='/expenses' element ={<ProtectedRoutes><Expense/></ProtectedRoutes>} />
        <Route path='/incomes' element ={<ProtectedRoutes><Income/></ProtectedRoutes>} />
       
        <Route path='/categories' element ={<ProtectedRoutes><Categories/></ProtectedRoutes>} />
        <Route path='/products' element ={<ProtectedRoutes><Products/></ProtectedRoutes>} />
        <Route path='/units' element ={<ProtectedRoutes><Units/></ProtectedRoutes>} />
        <Route path='/items' element ={<ProtectedRoutes><Items/></ProtectedRoutes>} />

        <Route path='/customers' element ={<ProtectedRoutes><Customers/></ProtectedRoutes>} />
        <Route path='/suppliers' element ={<ProtectedRoutes><Suppliers/></ProtectedRoutes>} />

        <Route path='/sales' element ={<ProtectedRoutes><Sales/></ProtectedRoutes>} />
        <Route path='/purchases' element ={<ProtectedRoutes><Buy/></ProtectedRoutes>} />
        <Route path='/production' element ={<ProtectedRoutes><Production /></ProtectedRoutes>} />

        <Route path='/invoices' element ={<ProtectedRoutes><Invoices /></ProtectedRoutes>} />
        <Route path='/proinvoices' element ={<ProtectedRoutes><ProInvoices /></ProtectedRoutes>} />

        <Route path ='/auth' element ={isAuth ? <Navigate to='/'/> : <Auth />}/>

        <Route path='/*' element={<div>Not Found</div>}/>

      </Routes>

    </>
  );
};



function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector(state => state.user);
  if (!isAuth) {
    return <Navigate to='/auth' />
  }

  return children;
}



const App = () => {
  return (
   
      <Router>
          <Layout />      
      </Router>
  );
}


export default App;