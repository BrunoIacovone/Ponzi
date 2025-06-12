import { useEffect, useState } from 'react';
import { useGetBalance } from '../../hooks/useWallet';
import { Amount } from '../../schemas/balance';

export default function Balance() {
  const { getBalance, loading, error } = useGetBalance();
  const [balance, setBalance] = useState<Amount | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const b = await getBalance();
      if (b) {
        setBalance(b);
      }
    };
    fetch();
  }, [getBalance]);

  if (loading) return <div>Loading balance...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      data-cy="balance-display"
      style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}
    >
      ${balance?.balance?.toFixed(2) || '0.00'}
      <div style={{ fontSize: 16, fontWeight: 400, color: '#888' }}>
        Current Balance
      </div>
    </div>
  );
}
