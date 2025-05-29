import { useEffect, useState } from 'react';
import { auth } from '../../auth/firebase';
import { FirebaseRealtimeWatcher } from '../../watcher/FirebaseRealtimeWatcher';

export default function Balance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }
    const watcher = new FirebaseRealtimeWatcher();
    watcher.watch<number>(`users/${user.uid}/balance`, (val) => {
      setBalance(val || 0);
      setLoading(false);
    });
    return () => watcher.clearAll();
  }, []);

  if (loading) return <div>Loading balance...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
      ${balance?.toFixed(2) || '0.00'}
      <div style={{ fontSize: 16, fontWeight: 400, color: '#888' }}>
        Current Balance
      </div>
    </div>
  );
}
