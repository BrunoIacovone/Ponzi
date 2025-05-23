import { useEffect, useState } from "react";
import Balance from "../components/Dashboard/Balance";
import QuickActions from "../components/Dashboard/QuickActions";
import { TransactionType } from "../components/Transaction/Filters";
import TransactionList from "../components/Transaction/TransactionList";

export default function Dashboard() {
  const [fromDate, setFromDate] = useState("");


  useEffect(() => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const from = threeMonthsAgo.toISOString().slice(0, 10);
    setFromDate(from);
  }, []);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <Balance />
      <QuickActions />
      <TransactionList type={TransactionType.All} fromDate={fromDate} toDate={null} />
    </div>
  );
} 