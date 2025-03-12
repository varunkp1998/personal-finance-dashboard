import { useState } from 'react';
import { signUp, login, logout } from '../lib/auth';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    setMessage(error ? error.message : 'Redirecting to Google login...');
  };
  
  
  const handleSignUp = async () => {
    const { error } = await signUp(email, password);
    setMessage(error ? error.message : 'Signed up successfully! Check your email.');
  };

  const handleLogin = async () => {
    const { error } = await login(email, password);
    setMessage(error ? error.message : 'Logged in successfully!');
  };

  return (
    <div className="flex flex-col items-center p-4">
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>;
      <button onClick={logout}>Logout</button>
      {message && <p>{message}</p>}
    </div>
  );
}
