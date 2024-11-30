import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App.jsx';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home.jsx';
import Cart from './Cart.jsx'
import MyOrders from './MyOrders.jsx'
import ForgotPassword from './ForgotPassword.jsx'
import { MobileProvider } from './MobileStorage.jsx';
import Wallet from './Wallet.jsx';
import MyReferrals from './MyReferrals.jsx';
import Settings from './Settings.jsx';
import CustomPopup from './CustomPopup.jsx';
import AdminRavi from './AdminRavi.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MobileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/realSolution/" element={<Login />} />
          <Route path="/realSolution/App" element={<App />} />
          <Route path="/realSolution/Login" element={<Login />} />
          <Route path="/realSolution/Home" element={<Home />} />
          <Route path="/realSolution/Cart" element={<Cart />} />
          <Route path="/realSolution/MyOrders" element={<MyOrders />} />
          <Route path="/realSolution/MobileProvider" element={<MobileProvider />} />
          <Route path="/realSolution/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/realSolution/Wallet" element={<Wallet />} />
          <Route path="/realSolution/Settings" element={<Settings />} />
          <Route path="/realSolution/MyReferrals" element={<MyReferrals />} />
          <Route path="/realSolution/CustomPopup" element={<CustomPopup />} />
          <Route path="/realSolution/AdminRavi" element={<AdminRavi />} />
        </Routes>
      </BrowserRouter>
    </MobileProvider>
  </StrictMode>
);
