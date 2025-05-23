import { use, useEffect, useState } from "react";
import { Transaction } from "../../api/wallet";
import { useGetTransactions } from "../../hooks/useWallet";
import { TransactionType } from "./Filters";
import { auth } from "../../auth/firebase";
import { FirebaseRealtimeWatcher } from "../../watcher/FirebaseRealtimeWatcher";

interface TransactionListProps {
    type: TransactionType;
    fromDate: string;
    toDate: string | null;
}

export default function TransactionList({
  type,
  fromDate,
  toDate,
}: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    const watcher = new FirebaseRealtimeWatcher();
    watcher.watch<Record<string, Transaction>>(
    `users/${user.uid}/transactions`,
    (val) => {
      const txList = val
        ? Object.values(val)
        : [];
        txList.reverse();
      setTransactions(txList);
      setLoading(false);
      console.log("Transactions:", txList);
      //ver como hacer para displayear el transaction.
    }
  );
  return () => watcher.clearAll();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    console.log("Transactions:", transactions);
    console.log("Filtered Transactions:", filteredTransactions);
    console.log("Type:", type);
    console.log("From Date:", fromDate);
    console.log("To Date:", toDate);

    // Filtrar por tipo
    if (type === TransactionType.Income) {
      filtered = filtered.filter((t) => t.direction === "received");
    } else if (type === TransactionType.Expense) {
      filtered = filtered.filter((t) => t.direction === "sent");
    }

    // Filtrar por fechas
    const from = new Date(fromDate).getTime();
    const to = toDate ? new Date(toDate).getTime() : Date.now();
    filtered = filtered.filter(
      (transaction) =>
        transaction.timestamp >= from && transaction.timestamp <= to
    );

    console.log("Filtered Transactions after filters:", filtered);

    setFilteredTransactions(filtered);
  }, [type, fromDate, toDate, transactions]);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log()
  
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
        Last 3 months transactions
      </div>
      {filteredTransactions.map((transaction) => {
        if (transaction.direction === "received") {
          return IncomeComponent(transaction.user, transaction.amount, transaction.timestamp);
        } else if (transaction.direction === "sent") {
          return ExpenseComponent(transaction.user, transaction.amount, transaction.timestamp);
        }
        return null;
      })}
    </div>
  );
}

function IncomeComponent (from : String, amount : number, timestamp : number) {
  return (
    <div style={{ background: '#f6f6f6', padding: 12, borderRadius: 8, marginBottom: 8 }}>
      <div style={{ color: 'green' }}>+ ${amount} <span style={{ color: '#888', fontSize: 12 }}>From {from}</span></div>
      <div style={{ fontSize: 12, color: '#888' }}>{formatDate(new Date(timestamp))}</div>
    </div>
  );
}

function ExpenseComponent (to : String, amount : number, timestamp : number) {
  return (
    <div style={{ background: '#f6f6f6', padding: 12, borderRadius: 8 }}>
      <div style={{ color: 'red' }}>- ${amount} <span style={{ color: '#888', fontSize: 12 }}>To {to}</span></div>
      <div style={{ fontSize: 12, color: '#888' }}>{formatDate(new Date(timestamp))}</div>
    </div>
  );
}


function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}