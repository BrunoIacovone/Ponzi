export default function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#222', color: '#fff', fontWeight: 600, cursor: 'pointer' }} {...props}>
      {children}
    </button>
  );
} 