import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import Dashboard from '../pages/Dashboard';
import TransactionHistory from '../pages/TransactionHistory';
import SendMoney from '../pages/SendMoney';
import AddFunds from '../pages/AddFunds';
import DebinRequest from '../pages/DebinRequest';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/history"
        element={user ? <TransactionHistory /> : <Navigate to="/login" />}
      />
      <Route
        path="/send"
        element={user ? <SendMoney /> : <Navigate to="/login" />}
      />
      <Route
        path="/add-funds"
        element={user ? <AddFunds /> : <Navigate to="/login" />}
      />
      <Route
        path="/debin"
        element={user ? <DebinRequest /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}
