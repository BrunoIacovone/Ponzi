export default function Filters() {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <select>
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
        <option value="transfer">Transfer</option>
      </select>
      <input type="date" />
      <input type="date" />
    </div>
  );
} 