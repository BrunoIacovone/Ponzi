import { useState } from 'react';
import { useAddFunds } from '../../hooks/useWallet';
import { useNavigate } from 'react-router-dom';

export default function AddFundsForm() {
  const [method, setMethod] = useState('card');
  const [amount, setAmount] = useState('');
  const { addFunds, loading, error } = useAddFunds();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const result = await addFunds(Number(amount));
    if (result) {
      // Handle successful addition of funds
      setAmount('');
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: '100%', marginBottom: 12 }}
        name="amount"
      />
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button type="button" onClick={() => setMethod('card')} name="card">
          Card
        </button>
        <button type="button" onClick={() => setMethod('bank')} name="bank">
          Bank
        </button>
        <button type="button" onClick={() => setMethod('debin')} name="debin">
          DEBIN
        </button>
      </div>
      {method === 'card' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Card Number" />
          <input placeholder="Expiry Date" />
          <input placeholder="CVC" />
          <input placeholder="Name on Card" />
        </div>
      )}
      {method === 'bank' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Bank Account" />
          <input placeholder="CBU/ALIAS" />
        </div>
      )}
      {method === 'debin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Bank" />
          <input placeholder="CBU/ALIAS" />
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
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
