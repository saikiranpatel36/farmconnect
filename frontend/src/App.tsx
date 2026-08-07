import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Landing from './components/Landing';
import ErrorPage from './components/ErrorPage';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import SupplierRoute from './components/SupplierRoute';
import OwnerRoute from './components/OwnerRoute';

import AddFeed from './supplier/AddFeed';
import ViewFeed from './supplier/ViewFeed';
import ViewRequest from './supplier/ViewRequest';

import LivestockForm from './owner/LivestockForm';
import MyRequest from './owner/MyRequest';
import OwnerViewFeed from './owner/OwnerViewFeed';
import ViewLivestock from './owner/ViewLivestock';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/error-page" element={<ErrorPage />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Supplier (admin) routes */}
        <Route path="/supplier/add-feed" element={<SupplierRoute><AddFeed /></SupplierRoute>} />
        <Route path="/supplier/add-feed/:id" element={<SupplierRoute><AddFeed /></SupplierRoute>} />
        <Route path="/supplier/view-feed" element={<SupplierRoute><ViewFeed /></SupplierRoute>} />
        <Route path="/supplier/view-request" element={<SupplierRoute><ViewRequest /></SupplierRoute>} />

        {/* Owner (user) routes */}
        <Route path="/owner/livestock-form" element={<OwnerRoute><LivestockForm /></OwnerRoute>} />
        <Route path="/owner/livestock-form/:id" element={<OwnerRoute><LivestockForm /></OwnerRoute>} />
        <Route path="/owner/my-request" element={<OwnerRoute><MyRequest /></OwnerRoute>} />
        <Route path="/owner/view-feed" element={<OwnerRoute><OwnerViewFeed /></OwnerRoute>} />
        <Route path="/owner/view-livestock" element={<OwnerRoute><ViewLivestock /></OwnerRoute>} />

        {/* Fallback */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
