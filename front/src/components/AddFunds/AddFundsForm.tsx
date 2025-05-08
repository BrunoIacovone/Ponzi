import { useState } from "react";

export default function AddFundsForm() {
  const [method, setMethod] = useState("card");
  return (
    <div>
      <input type="number" placeholder="Amount" style={{ width: '100%', marginBottom: 12 }} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button type="button" onClick={() => setMethod("card")}>Card</button>
        <button type="button" onClick={() => setMethod("bank")}>Bank</button>
        <button type="button" onClick={() => setMethod("debin")}>DEBIN</button>
      </div>
      {method === "card" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Card Number" />
          <input placeholder="Expiry Date" />
          <input placeholder="CVC" />
          <input placeholder="Name on Card" />
        </div>
      )}
      {method === "bank" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Bank Account" />
          <input placeholder="CBU/ALIAS" />
        </div>
      )}
      {method === "debin" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Bank" />
          <input placeholder="CBU/ALIAS" />
        </div>
      )}
      <button style={{ marginTop: 16, width: '100%' }}>Continue</button>
    </div>
  );
} 