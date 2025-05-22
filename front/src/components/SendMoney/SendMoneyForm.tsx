import { useEffect, useState } from "react";
import { useSendMoney } from "../../hooks/useWallet";
import { useNavigate } from "react-router-dom";

export default function SendMoneyForm() {
  const [amount , setAmount] = useState<number | null>(null);
  const [recipient, setRecipient] = useState<string>("");
  const { transferMoney, loading } = useSendMoney();
  const navigate = useNavigate();

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && recipient) {
      try {
        console.log(`Sending ${amount} to ${recipient}`);
        transferMoney(recipient, amount);
        navigate("/")
      } catch (error) {
        console.error("Error sending money:", error);
      }
    }
  };

  useEffect(() => {}, [loading])

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        type="number"
        placeholder="Amount"
        required
        onChange={e => setAmount(e.target.value === "" ? null : Number(e.target.value))}
      />
      <input
        type="email"
        placeholder="Recipient Email"
        required
        onChange={e => setRecipient(e.target.value)}
      />
      <input type="text" placeholder="Description (optional)" />
      <button type="submit" onClick={handleSubmit}>Send</button>
    </form>
  );
} 