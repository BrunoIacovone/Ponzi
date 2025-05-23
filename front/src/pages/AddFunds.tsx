import AddFundsForm from "../components/AddFunds/AddFundsForm";
import {useNavigate} from "react-router-dom";

export default function AddFunds() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/");
  };

  return (
      <div style={{maxWidth: 480, margin: '0 auto', padding: 16}}>
        <h2>Add Funds</h2>
        <AddFundsForm/>
        <button
            style={{marginTop: 26, width: '100%'}}
            onClick={goBack}
        >
          Go back to Dashboard
        </button>
      </div>
  );
} 