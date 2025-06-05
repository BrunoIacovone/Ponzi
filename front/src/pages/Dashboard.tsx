import { useEffect, useState } from 'react';
import Balance from '../components/Dashboard/Balance';
import QuickActions from '../components/Dashboard/QuickActions';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../auth/firebase.ts';
import { TransactionType } from '../components/Transaction/Filters';
import TransactionList from '../components/Transaction/TransactionList';

export default function Dashboard() {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  useEffect(() => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const from = threeMonthsAgo.toISOString().slice(0, 10);
    setFromDate(from);
  }, []);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <button
        name="logout"
        onClick={handleLogout}
        style={{
          marginTop: 16,
          padding: '12px 16px',
          background: '#e53e3e',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Log out
      </button>
      <Balance />
      <QuickActions />
      <TransactionList
        type={TransactionType.All}
        fromDate={fromDate}
        toDate={null}
      />
    </div>
  );
}
