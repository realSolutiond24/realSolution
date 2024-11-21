import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App.jsx';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home.jsx';
import Cart from './Cart.jsx'
import MyOrders from './MyOrders.jsx'
import { MobileProvider } from './MobileStorage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MobileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/realSolution/" element={<App />} />
          <Route path="/realSolution/App" element={<App />} />
          <Route path="/realSolution/Login" element={<Login />} />
          <Route path="/realSolution/Home" element={<Home />} />
          <Route path="/realSolution/Cart" element={<Cart />} />
          <Route path="/realSolution/MyOrders" element={<MyOrders />} />
        </Routes>
      </BrowserRouter>
    </MobileProvider>
  </StrictMode>
);
