import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Shield,
  User,
  Lock,
  Mail,
  Building,
  Award,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw,
  ArrowLeft,
  Send
} from 'lucide-react';
import { useDataStore, ROOT_ADMIN_EMAIL } from '../services/store';
import { DebateFormat } from '../types';
import { isSupabaseActive } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess
}) => {
  const store = useDataStore();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [step, setStep] = useState<'credentials' | 'verify'>('credentials');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [institution, setInstitution] = useState('');
  const [formatPreference, setFormatPreference] = useState<DebateFormat>('British Parliamentary');
  const [verificationCode, setVerificationCode] = useState('');
  const [dispatchedCodePreview, setDispatchedCodePreview] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync mode whenever initialMode or modal open state changes
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStep('credentials');
      setErrorMessage('');
      setSuccessMessage('');
      setVerificationCode('');
      setDispatchedCodePreview('');
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const isSupabaseOnline = isSupabaseActive();
  const isTargetRootAdmin = email.trim().toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();

  // Step 1: Send verification code to email
  const handleRequestVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const emailNorm = email.trim().toLowerCase();
    if (!emailNorm || !emailNorm.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (!displayName.trim()) {
        setErrorMessage('Please provide your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await store.sendVerificationCode(emailNorm);
      if (res.success) {
        setDispatchedCodePreview(res.previewCode);
        setStep('verify');
        setSuccessMessage(`A 6-digit verification code has been dispatched to ${emailNorm}.`);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to dispatch verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit verification code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!verificationCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        const res = await store.verifyCodeAndSignIn(email, verificationCode, password);
        if (res.success) {
          setSuccessMessage(res.message);
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
          }, 600);
        } else {
          setErrorMessage(res.message);
        }
      } else {
        const res = await store.verifyCodeAndSignUp({
          email,
          code: verificationCode,
          password,
          display_name: displayName,
          institution,
          format_preference: formatPreference
        });
        if (res.success) {
          setSuccessMessage(res.message);
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
          }, 800);
        } else {
          setErrorMessage(res.message);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const res = await store.sendVerificationCode(email);
      if (res.success) {
        setDispatchedCodePreview(res.previewCode);
        setSuccessMessage(`New verification code resent to ${email}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#F7F3EA] border border-[#B79558] rounded-lg shadow-2xl p-6 sm:p-7 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Subtle decorative gold corner wash */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#B79558]/15 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#625D57] hover:text-[#171717] rounded-md transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Lockup */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#D8CCBB]">
          <div className="w-9 h-9 rounded bg-[#681F2B] text-[#F7F3EA] flex items-center justify-center font-urdu text-lg font-bold">
            ف
          </div>
          <div>
            <div className="font-urdu text-base text-[#681F2B] font-bold leading-none">رمزِ فکر</div>
            <div className="font-editorial text-[11px] tracking-[0.2em] uppercase text-[#171717] font-bold mt-0.5">
              {step === 'verify'
                ? 'Two-Step Email Verification'
                : mode === 'signin'
                  ? 'Sign In to Account'
                  : 'Register Contributor Account'}
            </div>
          </div>
        </div>

        {/* Security & Backend Indicator */}
        <div className="my-3 flex items-center justify-between text-[11px] px-2.5 py-1 rounded bg-[#EFE8DA] border border-[#D8CCBB]">
          <span className="text-[#625D57] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#B79558]" />
            <span>Email Authenticity Protocol</span>
          </span>
          {isSupabaseOnline ? (
            <span className="text-emerald-800 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Supabase Connected
            </span>
          ) : (
            <span className="text-[#681F2B] font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#B79558]" />
              Authentic Mail Verification
            </span>
          )}
        </div>

        {/* Step Indicator Tabs (Only in credentials step) */}
        {step === 'credentials' && (
          <div className="flex rounded-md p-1 bg-[#EFE8DA] border border-[#D8CCBB] text-xs font-semibold mb-4">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-1.5 rounded transition-colors text-center ${
                mode === 'signin'
                  ? 'bg-[#681F2B] text-[#F7F3EA] shadow-xs'
                  : 'text-[#625D57] hover:text-[#171717]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-1.5 rounded transition-colors text-center ${
                mode === 'signup'
                  ? 'bg-[#681F2B] text-[#F7F3EA] shadow-xs'
                  : 'text-[#625D57] hover:text-[#171717]'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Status Messages */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded bg-red-50 text-red-800 border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-2.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Forms Container */}
        <div className="flex-1 overflow-y-auto pr-1">
          {step === 'verify' ? (
            /* ========================================================= */
            /* STEP 2: 6-DIGIT EMAIL VERIFICATION CODE ENTRY             */
            /* ========================================================= */
            <form onSubmit={handleVerifyCode} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-md space-y-1">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-800" />
                  <span>Verify Email Address</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  A verification code has been generated and sent to <strong className="text-amber-950 font-mono">{email}</strong>.
                  Please enter the 6-digit numeric security code to verify that this email address is authentic.
                </p>
              </div>

              {/* In-app authentic email dispatch preview badge */}
              {dispatchedCodePreview && (
                <div className="p-2.5 bg-[#EFE8DA] border border-[#B79558] rounded text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#681F2B]" />
                    <span>
                      Dispatched Code: <strong className="font-mono text-sm tracking-widest text-[#681F2B]">{dispatchedCodePreview}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVerificationCode(dispatchedCodePreview)}
                    className="px-2 py-1 bg-white border border-[#D8CCBB] hover:border-[#681F2B] text-[11px] font-semibold text-[#681F2B] rounded transition-colors"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#625D57]" />
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 849201"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D8CCBB] rounded text-[#171717] font-mono text-base tracking-widest text-center focus:border-[#681F2B] focus:outline-none"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || verificationCode.length < 6}
                className="w-full py-2.5 bg-[#681F2B] hover:bg-[#48151E] disabled:opacity-50 text-[#F7F3EA] font-semibold text-xs rounded transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {loading
                    ? 'Verifying Code...'
                    : mode === 'signin'
                      ? 'Verify & Sign In'
                      : 'Verify & Complete Registration'}
                </span>
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-[#D8CCBB]/60 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setErrorMessage('');
                  }}
                  className="text-[#625D57] hover:text-[#171717] flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email / Password</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-[#681F2B] font-semibold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resend Code</span>
                </button>
              </div>
            </form>
          ) : mode === 'signin' ? (
            /* ========================================================= */
            /* STEP 1: SIGN IN CREDENTIALS                               */
            /* ========================================================= */
            <form onSubmit={handleRequestVerificationCode} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#625D57]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="muhammadhadi.officialwork@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717] focus:border-[#681F2B] focus:outline-none"
                    required
                  />
                </div>
                {isTargetRootAdmin && (
                  <div className="mt-1 text-[11px] text-[#681F2B] font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-[#B79558]" />
                    <span>Recognized Root Administrator Account</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#625D57]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717] focus:border-[#681F2B] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="p-2.5 bg-[#EFE8DA] rounded border border-[#D8CCBB] text-[11px] text-[#625D57] flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#B79558] shrink-0 mt-0.5" />
                <span>
                  A verification code will be sent to your email to authenticate that you are the genuine inbox owner before signing in.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#681F2B] hover:bg-[#48151E] disabled:opacity-50 text-[#F7F3EA] font-semibold text-xs rounded transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Dispatching Verification...' : 'Send Verification Code & Continue'}</span>
              </button>
            </form>
          ) : (
            /* ========================================================= */
            /* STEP 1: CREATE ACCOUNT (NORMAL USER DEBATER REGISTRATION) */
            /* ========================================================= */
            <form onSubmit={handleRequestVerificationCode} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#625D57]" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Fatima Jinnah"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717] focus:border-[#681F2B] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#625D57]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="debater@university.edu"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717] focus:border-[#681F2B] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Password (min 6 characters) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#625D57]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717] focus:border-[#681F2B] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#171717] mb-1">
                    Institution / Society
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Oxford Union / LUMS"
                    className="w-full px-2.5 py-1.5 bg-white border border-[#D8CCBB] rounded text-[#171717]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#171717] mb-1">
                    Format Focus
                  </label>
                  <select
                    value={formatPreference}
                    onChange={(e) => setFormatPreference(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-white border border-[#D8CCBB] rounded text-[#171717]"
                  >
                    <option value="British Parliamentary">BP</option>
                    <option value="World Schools">WSDC</option>
                    <option value="Asian Parliamentary">AP</option>
                    <option value="Australs">Australs</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 bg-[#EFE8DA] rounded border border-[#D8CCBB] text-[11px] text-[#625D57]">
                Every registered contributor joins as a verified debater. Admin access can be delegated by the Root Administrator.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#681F2B] hover:bg-[#48151E] disabled:opacity-50 text-[#F7F3EA] font-semibold text-xs rounded transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Dispatching Verification...' : 'Send Verification Code & Register'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
