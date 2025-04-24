import {useAuth} from "./auth/authContext.tsx";
import Login from "./components/Login.tsx";

function App() {
  const { user } = useAuth();

  if (!user) return <Login />;
  return <div className="p-4">Bienvenido, {user.email}</div>;
}

export default App;
