import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <button style={{ flex: 1 }} onClick={() => navigate('/add-funds')} name="add-founds">Add Funds</button>
      <button style={{ flex: 1 }} onClick={() => navigate('/send')} name="send-money">Send Money</button>
      <button style={{ flex: 1 }} onClick={() => navigate('/history')} name="history">History</button>
    </div>
  );
} 