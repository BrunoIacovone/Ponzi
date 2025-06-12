import { useState } from 'react';
import { useDebin } from '../../hooks/useWallet';
import { useNavigate } from 'react-router-dom';

export default function DebinForm() {
  const [amount, setAmount] = useState('');
  const [bankEmail, setBankEmail] = useState('');
  const { debin, loading, error } = useDebin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const result = await debin(Number(amount), bankEmail);
    if (result) {
      setAmount('');
      setBankEmail('');
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="string"
          placeholder="Bank Email"
          value={bankEmail}
          onChange={(e) => setBankEmail(e.target.value)}
          name="bankEmail"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          name="amount"
        />
      </div>
      {error && <div className="error" style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <button
        type="submit"
        style={{ marginTop: 16, width: '100%' }}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Continue'}
      </button>
    </form>
  );
}
