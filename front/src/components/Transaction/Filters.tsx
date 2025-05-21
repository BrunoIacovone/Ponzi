
type FiltersProps = {
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
  fromDate: string;
  onFromDateChange: (date: string) => void;
  toDate: string;
  onToDateChange: (date: string) => void;
  fromPlaceholder?: string;
  toPlaceholder?: string;
};

export default function Filters({
  type,
  onTypeChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  fromPlaceholder,
  toPlaceholder,
}: FiltersProps) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <select value={type} onChange={e => onTypeChange(e.target.value as TransactionType)}>
        <option value={TransactionType.All}>All</option>
        <option value={TransactionType.Income}>Income</option>
        <option value={TransactionType.Expense}>Expense</option>
        <option value={TransactionType.Transfer}>Transfer</option>
      </select>
      <input
        type="date"
        value={fromDate}
        onChange={e => onFromDateChange(e.target.value)}
        placeholder={fromPlaceholder}
      />
      <input
        type="date"
        value={toDate}
        onChange={e => onToDateChange(e.target.value)}
        placeholder={toPlaceholder}
      />
    </div>
  );
} 

export enum TransactionType {
  All = "all",
  Income = "income",
  Expense = "expense",
  Transfer = "transfer",
}