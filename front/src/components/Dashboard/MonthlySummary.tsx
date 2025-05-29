export default function MonthlySummary() {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <span style={{ color: 'green' }}>Income</span>
        <span>$1,250.00</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'red' }}>Expenses</span>
        <span>$450.25</span>
      </div>
    </div>
  );
}
