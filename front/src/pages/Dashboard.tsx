import Balance from "../components/Dashboard/Balance";
import QuickActions from "../components/Dashboard/QuickActions";
import RecentActivity from "../components/Dashboard/RecentActivity";
import {useNavigate} from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase.ts"

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      navigate('/login');
    }
    catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  return (
      <div style={{maxWidth: 480, margin: '0 auto', padding: 16}}>
        <button
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
        <Balance/>
        <QuickActions/>
        <RecentActivity/>
      </div>
  );
} 