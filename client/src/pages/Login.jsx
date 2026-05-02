import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound, ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import '../styles/Login.css';

const Login = () => {
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email);
      toast.success(res.message);
      setStep(2);
      setTimer(60); // 60 seconds countdown
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.success("Login successful!");
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="h2">Welcome Back.</h1>
          <p className="text-secondary">Enter your details to access your account.</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="login-form">
            <div className="form-group input-with-icon">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                className="form-input pl-10"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Sending..." : "Continue with Email"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <p className="text-secondary mb-4 text-center">OTP sent to <strong>{email}</strong></p>
            <div className="form-group input-with-icon">
              <KeyRound className="input-icon" size={20} />
              <input
                type="number"
                className="form-input pl-10"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <div className="resend-actions mt-4 text-center">
              {timer > 0 ? (
                <p className="text-secondary text-sm">Resend OTP in {timer}s</p>
              ) : (
                <button 
                  type="button" 
                  onClick={handleSendOtp} 
                  className="btn btn-outline w-full resend-btn"
                  disabled={loading}
                >
                  <RefreshCw size={16} /> Resend OTP
                </button>
              )}
            </div>
            <button 
              type="button" 
              className="btn btn-outline w-full mt-4" 
              onClick={() => { setStep(1); setOtp(''); }}
              disabled={loading}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
