export default function SendMoneyForm() {
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input type="number" placeholder="Amount" required />
      <input type="email" placeholder="Recipient Email or ID" required />
      <input type="text" placeholder="Description (optional)" />
      <button type="submit">Send</button>
    </form>
  );
} 