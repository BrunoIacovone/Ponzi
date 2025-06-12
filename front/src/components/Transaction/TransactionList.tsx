import { useEffect, useState } from 'react';
import { Transaction } from '../../api/wallet';
import { TransactionType } from './Filters';
import { useGetTransactions } from '../../hooks/useWallet';

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
  const { getTransactions, loading, error } = useGetTransactions();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  useEffect(() => {
    const fetch = async () => {
      const t = await getTransactions();
      if (t) {
        setTransactions(t);
      }
    };
    fetch();
  }, [getTransactions]);

  useEffect(() => {
    let filtered = transactions;

    // Filtrar por tipo
    if (type === TransactionType.Income) {
      filtered = filtered.filter((t) => t.direction === 'received');
    } else if (type === TransactionType.Expense) {
      filtered = filtered.filter((t) => t.direction === 'sent');
    }

    // Filtrar por fechas
    const from = fromDate ? new Date(fromDate).getTime() : 0;
    const to = toDate ? new Date(toDate).getTime() : Date.now();
    filtered = filtered.filter(
      (transaction) =>
        transaction.timestamp >= from && transaction.timestamp <= to,
    );

    setFilteredTransactions(filtered);
  }, [type, fromDate, toDate, transactions]);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div data-cy="transaction-list">
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
        Last 3 months transactions
      </div>
      {filteredTransactions.length === 0 ? (
        <div data-cy="no-transactions-message">No transactions found</div>
      ) : (
        filteredTransactions.map((transaction) => {
          if (transaction.direction === 'received') {
            return IncomeComponent(
              transaction.userName,
              transaction.amount,
              transaction.timestamp,
            );
          } else if (transaction.direction === 'sent') {
            return ExpenseComponent(
              transaction.userName,
              transaction.amount,
              transaction.timestamp,
            );
          }
          return null;
        })
      )}
    </div>
  );
}

function IncomeComponent(from: string, amount: number, timestamp: number) {
  const fromText = `From ${from}`;
  return (
    <div
      data-cy="transaction-item"
      style={{
        background: '#f6f6f6',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
      }}
    >
      <div style={{ color: 'green' }}>
        + ${amount}{' '}
        <span style={{ color: '#888', fontSize: 12 }}>{fromText}</span>
      </div>
      <div style={{ fontSize: 12, color: '#888' }}>
        {formatDate(new Date(timestamp))}
      </div>
    </div>
  );
}

function ExpenseComponent(to: String, amount: number, timestamp: number) {
  return (
    <div
      data-cy="transaction-item"
      style={{
        background: '#f6f6f6',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
      }}
    >
      <div style={{ color: 'red' }}>
        - ${amount} <span style={{ color: '#888', fontSize: 12 }}>To {to}</span>
      </div>
      <div style={{ fontSize: 12, color: '#888' }}>
        {formatDate(new Date(timestamp))}
      </div>
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
