import { useAuth } from "./auth/authContext";
import Login from "./components/Login";
import AppRouter from "./routes/AppRouter";

function App() {
  const { user } = useAuth();
  if (!user) return <Login />;
  return <AppRouter />;
}

export default App;


