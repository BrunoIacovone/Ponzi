import Balance from "../components/Dashboard/Balance";
import QuickActions from "../components/Dashboard/QuickActions";
import MonthlySummary from "../components/Dashboard/MonthlySummary";
import RecentActivity from "../components/Dashboard/RecentActivity";

export default function Dashboard() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <Balance />
      <QuickActions />
      <MonthlySummary />
      <RecentActivity />
    </div>
  );
} 