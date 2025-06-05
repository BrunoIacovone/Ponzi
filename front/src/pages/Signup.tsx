import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../auth/firebase.ts';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f6f6f6',
        padding: 16,
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          background: '#fff',
          boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
          borderRadius: 16,
          padding: 32,
          width: '100%',
          maxWidth: 360,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 24,
            textAlign: 'center',
            color: '#222',
          }}
        >
          Crear cuenta
        </h2>
        {error && (
          <p style={{ color: '#e53e3e', marginBottom: 16, fontSize: 14 }}>
            {error}
          </p>
        )}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, color: '#555' }}>
            Email
          </label>
          <input
            type="email"
            style={{
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 16,
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 4, color: '#555' }}>
            Contraseña
          </label>
          <input
            type="password"
            style={{
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 16,
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            background: '#222',
            color: '#fff',
            padding: '12px 0',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            marginBottom: 12,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span style={{ color: '#555', fontSize: 14 }}>
            ¿Ya tienes cuenta?{' '}
          </span>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: 14,
            }}
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  );
}
