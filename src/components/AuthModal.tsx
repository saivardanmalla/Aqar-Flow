import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AqarFlowLogo } from './AqarFlowLogo';
import { api } from '../lib/api';
import { 
  X, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  UserCheck,
  Building,
  Phone,
  User
} from 'lucide-react';
import villaPhoto from '../assets/images/property_islamabad_villa_1794204424374.jpg';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register, switchDemoRole } = useAuth();
  
  // Tab Mode: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Server Type: 'user' (Public / All Users Server) | 'admin' (Dedicated Admin Only Server)
  const [loginServerType, setLoginServerType] = useState<'user' | 'admin'>('user');
  
  // Login states
  const [email, setEmail] = useState('admin@aqarflow.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Registration states
  const [regFullName, setRegFullName] = useState('');
  const [regAgencyName, setRegAgencyName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const passwordScore = getPasswordStrength(regPassword);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  if (!isOpen) return null;

  // Handle standard login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password, loginServerType);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({
        full_name: regFullName,
        agency_name: regAgencyName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.forgotPassword(forgotEmail);
      setForgotSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT SECTION: Brand Hero & Building Photograph */}
        <div 
          style={{ backgroundColor: '#142B4A' }}
          className="hidden md:flex md:w-5/12 relative flex-col justify-between p-8 text-white overflow-hidden"
        >
          <img
            src={villaPhoto}
            alt="AQARFLOW VIRELEO Real Estate Architecture"
            className="absolute inset-0 w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#142B4A] via-[#142B4A]/70 to-transparent" />

          {/* Branding */}
          <div className="relative z-10 space-y-1">
            <AqarFlowLogo size="sm" variant="dark" />
            <div className="text-[10px] tracking-widest uppercase font-bold text-slate-400 pl-10">
              A VIRELEO PROJECT
            </div>
          </div>

          {/* Left Heading & Supporting Copy */}
          <div className="relative z-10 space-y-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                Manage Your Properties. <br />
                Simplify Your Business.
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                A connected real estate ERP, CRM, and property operations platform engineered for modern agencies.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs text-slate-200 font-medium">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Property Management</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Customer & Lead Management</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Deal Tracking & Closings</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Business Analytics & Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: Forms Container */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-between bg-white overflow-y-auto">
          <div className="space-y-6">

            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {/* MODE 1: LOGIN PAGE */}
            {mode === 'login' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#172033] tracking-tight">
                    Welcome Back
                  </h3>
                  <p className="text-xs text-[#718096] mt-1">
                    Sign in to your AQARFLOW workspace.
                  </p>
                </div>

                {/* 2 Login Server Selector */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Authentication Server
                  </div>
                  <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginServerType('user');
                        setError(null);
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        loginServerType === 'user'
                          ? 'bg-white text-blue-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>User Login</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginServerType('admin');
                        setError(null);
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        loginServerType === 'admin'
                          ? 'bg-slate-900 text-emerald-400 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Only Server</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-0.5">
                    {loginServerType === 'user' ? (
                      <span className="text-blue-600 font-medium">Standard Server: All users (tenants, buyers, agents) can sign in.</span>
                    ) : (
                      <span className="text-emerald-700 font-medium">Restricted Server: Exclusively for Agency Admins. Non-admin logins are blocked.</span>
                    )}
                  </div>
                </div>

                {/* Credentials Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@aqarflow.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-slate-600 font-medium">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null); }}
                      className="font-bold text-[#2563EB] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                {/* 1-Click Role Access */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Demo Role Access
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold">Ready</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => switchDemoRole('agency_admin').then(() => { if (onSuccess) onSuccess(); onClose(); })}
                      className="py-1.5 px-2 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Admin Portal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => switchDemoRole('agent').then(() => { if (onSuccess) onSuccess(); onClose(); })}
                      className="py-1.5 px-2 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Agent Portal</span>
                    </button>
                  </div>
                </div>

                {/* Bottom link to Register */}
                <div className="text-center text-xs text-slate-500 pt-1">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setError(null); }}
                    className="font-bold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Create Your Account
                  </button>
                </div>
              </div>
            )}

            {/* MODE 2: REGISTRATION PAGE */}
            {mode === 'register' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-black text-[#172033] tracking-tight">
                    Create Your AQARFLOW Account
                  </h3>
                  <p className="text-xs text-[#718096] mt-1">
                    Start managing your real estate business smarter.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Business / Agency Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Premier Properties"
                        value={regAgencyName}
                        onChange={(e) => setRegAgencyName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="name@agency.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-3.5 py-2 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {regPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`flex-1 rounded-full ${
                                passwordScore >= step ? strengthColors[passwordScore] : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          Strength: <span className="text-slate-800">{strengthLabels[passwordScore]}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[11px] text-slate-600 leading-tight">
                      I agree to the{' '}
                      <a href="#terms" onClick={(e) => e.preventDefault()} className="text-blue-600 font-bold hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-blue-600 font-bold hover:underline">
                        Privacy Policy
                      </a>.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>

                {/* Back to Login link */}
                <div className="text-center text-xs text-slate-500 pt-1">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(null); }}
                    className="font-bold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}

            {/* MODE 3: FORGOT PASSWORD PAGE */}
            {mode === 'forgot' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#172033] tracking-tight">
                    Reset Password
                  </h3>
                  <p className="text-xs text-[#718096] mt-1">
                    Enter your registered email address to receive password recovery instructions.
                  </p>
                </div>

                {forgotSent ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-3">
                    <div className="font-bold text-sm">Reset Link Dispatched</div>
                    <p className="leading-relaxed">
                      We have sent instructions and a secure recovery link to <strong>{forgotEmail}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setForgotSent(false); }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setMode('login'); setError(null); }}
                      className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-semibold py-1 cursor-pointer"
                    >
                      Back to Login
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Terms and Privacy Footer */}
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              By proceeding, you agree to AQARFLOW's{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()} className="text-slate-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-slate-600 hover:underline">Privacy Policy</a>.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
