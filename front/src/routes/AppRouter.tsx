import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import TransactionHistory from "../pages/TransactionHistory";
import SendMoney from "../pages/SendMoney";
import AddFunds from "../pages/AddFunds";
import DebinRequest from "../pages/DebinRequest";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<TransactionHistory />} />
        <Route path="/send" element={<SendMoney />} />
        <Route path="/add-funds" element={<AddFunds />} />
        <Route path="/debin" element={<DebinRequest />} />
      </Routes>
    </BrowserRouter>
  );
} 