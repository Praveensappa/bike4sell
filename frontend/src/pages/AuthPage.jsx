import { useState } from 'react';
import api from '../api/client';

export default function AuthPage() {
  const [registerData, setRegisterData] = useState({ name: '', email: '', mobile: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');

  const register = async () => {
    try {
      await api.post('/auth/register', registerData);
      setOtpEmail(registerData.email);
      setMsg('Registered. Verify OTP with 123456');
    } catch (e) { setMsg(e.response?.data?.message || 'Register failed'); }
  };

  const verifyOtp = async () => {
    try {
      await api.post('/auth/verify-otp', { email: otpEmail, otp });
      setMsg('OTP verified');
    } catch (e) { setMsg(e.response?.data?.message || 'OTP verify failed'); }
  };

  const login = async () => {
    try {
      const { data } = await api.post('/auth/login', loginData);
      localStorage.setItem('token', data.token);
      setMsg('Login successful');
    } catch (e) { setMsg(e.response?.data?.message || 'Login failed'); }
  };

  return (
    <main className="container">
      <h2>Authentication</h2>
      <p>{msg}</p>
      <section className="panel">
        <h3>Register</h3>
        <input placeholder="Name" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} />
        <input placeholder="Email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
        <input placeholder="Mobile" value={registerData.mobile} onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })} />
        <input placeholder="Password" type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
        <button onClick={register}>Register</button>
      </section>
      <section className="panel">
        <h3>OTP Verification</h3>
        <input placeholder="Email" value={otpEmail} onChange={(e) => setOtpEmail(e.target.value)} />
        <input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <button onClick={verifyOtp}>Verify OTP</button>
      </section>
      <section className="panel">
        <h3>Login</h3>
        <input placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
        <input placeholder="Password" type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
        <button onClick={login}>Login</button>
      </section>
    </main>
  );
}
