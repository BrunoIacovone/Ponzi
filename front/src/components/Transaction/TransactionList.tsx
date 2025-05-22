import { useEffect, useState } from "react";
import { Transaction } from "../../api/wallet";
import { useGetTransactions } from "../../hooks/useWallet";
import { TransactionType } from "./Filters";

interface TransactionListProps {
    type: TransactionType;
    fromDate: string;
    toDate: string;
}

export default function TransactionList({
  type,
  fromDate,
  toDate,
}: TransactionListProps) {

  // solo me falta  cambiar transactions para que cambie segun cambios en type, fromDate o toDate
  const { getTransactions, loading, error } = useGetTransactions();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

    useEffect(() => {
      getTransactions().then((res) => {
        if (res) {
          setTransactions(res);
        }
      });
    }, []);

    useEffect(() => {
        if (type === TransactionType.All || type === TransactionType.Transfer) {
          return setFilteredTransactions(transactions);
        }
        filteredTransactions.filter ((transaction) => {
          (transaction.direction === "received"  && type === TransactionType.Income) || (transaction.direction === "sent" && type === TransactionType.Expense);})
  }, [type])

    useEffect(() => {
      if (fromDate && toDate) {
        const from = new Date(fromDate).getTime();
        const to = new Date(toDate).getTime();
        setFilteredTransactions(transactions.filter(transaction => transaction.timestamp >= from && transaction.timestamp <= to));
      } else {
        setFilteredTransactions(transactions);
      }
    }, [fromDate, toDate]);

  
    if (loading) return <div>Loading balance...</div>;
    if (error) return <div>Error: {error}</div>;
    
  return (
    <div>
      {
        transactions.map((transaction) => {
          if (transaction.direction === "received") {
            return IncomeComponent(transaction.user, transaction.amount, transaction.timestamp);
          } else if (transaction.direction === "sent") {
            return ExpenseComponent(transaction.user, transaction.amount, transaction.timestamp);
          }
        })
      }
      {/* <div style={{ background: '#f6f6f6', padding: 12, borderRadius: 8, marginBottom: 8 }}>
        <div style={{ color: 'green' }}>+ $250.00 <span style={{ color: '#888', fontSize: 12 }}>From John Doe</span></div>
        <div style={{ fontSize: 12, color: '#888' }}>Today, 2:30 PM</div>
      </div>
      <div style={{ background: '#f6f6f6', padding: 12, borderRadius: 8 }}>
        <div style={{ color: 'red' }}>- $120.50 <span style={{ color: '#888', fontSize: 12 }}>To Coffee Shop</span></div>
        <div style={{ fontSize: 12, color: '#888' }}>Yesterday, 9:15 AM</div>
      </div> */}
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