import { useState } from "react";

const steps = ["Select Bank", "Enter Amount", "Confirm", "Success"];

export default function DebinRequestFlow() {
  const [step, setStep] = useState(0);
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        Step {step + 1} of {steps.length}: {steps[step]}
      </div>
      {step === 0 && <div>Select your bank (placeholder)</div>}
      {step === 1 && <div>Enter amount (placeholder)</div>}
      {step === 2 && <div>Confirm details (placeholder)</div>}
      {step === 3 && <div>Success! (placeholder)</div>}
      <div style={{ marginTop: 16 }}>
        {step > 0 && <button onClick={() => setStep(step - 1)}>Back</button>}
        {step < steps.length - 1 && (
          <button onClick={() => setStep(step + 1)} style={{ marginLeft: 8 }}>Next</button>
        )}
      </div>
    </div>
  );
} 