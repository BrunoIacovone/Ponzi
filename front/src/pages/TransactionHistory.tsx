import TransactionList from "../components/Transaction/TransactionList";
import Filters from "../components/Transaction/Filters";

export default function TransactionHistory() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <h2>Transaction History</h2>
      <Filters />
      <TransactionList />
    </div>
  );
} 