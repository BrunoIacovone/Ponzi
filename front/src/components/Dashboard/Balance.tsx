import { useEffect, useState } from 'react';
import { useGetBalance } from '../../hooks/useWallet';

export default function Balance() {
  const { getBalance, loading, error } = useGetBalance();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    getBalance().then((res) => {
      if (res) {
        setBalance(res.balance);
      }
    });
  }, []);

  if (loading) return <div>Loading balance...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
      ${balance?.toFixed(2) || '0.00'}
      <div style={{ fontSize: 16, fontWeight: 400, color: '#888' }}>Current Balance</div>
    </div>
  );
} 