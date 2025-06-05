import DebinForm from '../components/AddFunds/DebinForm';
import { useNavigate } from 'react-router-dom';

export default function Debin() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <h2>DEBIN</h2>
      <DebinForm />
      <button style={{ marginTop: 26, width: '100%' }} onClick={goBack}>
        Go back to Dashboard
      </button>
    </div>
  );
}
