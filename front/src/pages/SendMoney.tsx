import SendMoneyForm from '../components/SendMoney/SendMoneyForm';
import { useNavigate } from 'react-router-dom';

export default function SendMoney() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <h2>Send Money</h2>
      <SendMoneyForm />
      <button style={{ marginTop: 26, width: '100%' }} onClick={goBack}>
        Go back to Dashboard
      </button>
    </div>
  );
}
