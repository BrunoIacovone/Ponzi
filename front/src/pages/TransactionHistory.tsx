import TransactionList from "../components/Transaction/TransactionList";
import Filters, { TransactionType } from "../components/Transaction/Filters";
import { useState } from "react";
import {useNavigate} from "react-router-dom";

export default function TransactionHistory() {
  const [type, setType] = useState(TransactionType.All);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/");
  };

  return (
      <div style={{maxWidth: 480, margin: '0 auto', padding: 16}}>
        <h2>Transaction History</h2>
        <Filters
            type={type}
            onTypeChange={setType}
            fromDate={fromDate}
            onFromDateChange={setFromDate}
            toDate={toDate}
            onToDateChange={setToDate}
        />
        <TransactionList
            type={type}
            fromDate={fromDate}
            toDate={toDate}
        />
        <button
            style={{marginTop: 26, width: '100%'}}
            onClick={goBack}
        >
          Go back to Dashboard
        </button>
      </div>
  );
} 