
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Language, TranslationStrings } from '../types';

interface LoginProps {
  language: Language;
  t: TranslationStrings;
  onLoginSuccess: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ language, t, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(userCredential.user);
    } catch (err: any) {
      setError(language === 'ar' ? 'خطأ في البريد الإلكتروني أو كلمة المرور' : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0d1117] p-4 font-['Noto_Sans_Arabic']" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Logo Section */}
      <div className="flex items-center gap-2 mb-8 animate-in fade-in zoom-in duration-700">
        <span className="text-2xl font-bold text-white tracking-wide">زمام</span>
        <div className="w-10 h-10 bg-gradient-to-br from-[#d946ef] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span className="text-white font-bold text-xl">Z</span>
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-[#161b22] rounded-[32px] p-10 shadow-2xl border border-white/5 animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-center text-white mb-2">تسجيل الدخول</h1>
        <p className="text-gray-400 text-center text-sm mb-8">مرحباً بعودتك! سجل دخولك للمتابعة</p>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300 block px-1">
              البريد الإلكتروني <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="binawad1@gmail.com"
                className="w-full h-12 bg-[#e8f0fe] rounded-xl px-12 text-gray-800 placeholder-gray-400 focus:ring-2 ring-purple-500/50 outline-none transition-all"
              />
              <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-4' : 'left-4'} flex items-center text-gray-400`}>
                <i className="far fa-envelope"></i>
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300 block px-1">
              كلمة المرور <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-[#e8f0fe] rounded-xl px-12 text-gray-800 outline-none focus:ring-2 ring-purple-500/50 transition-all"
              />
              <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-4' : 'left-4'} flex items-center text-gray-400`}>
                <i className="fas fa-lock"></i>
              </div>
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 ${language === 'ar' ? 'left-4' : 'right-4'} flex items-center text-gray-400 hover:text-gray-600`}
              >
                <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-transparent text-purple-600 focus:ring-purple-500" />
              <span className="group-hover:text-gray-300 transition-colors">تذكرني</span>
            </label>
            <button type="button" className="text-pink-500 hover:text-pink-400 transition-colors">نسيت كلمة المرور؟</button>
          </div>

          {error && <p className="text-red-500 text-xs text-center animate-shake">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <i className={`fas fa-arrow-left group-hover:-translate-x-1 transition-transform ${language === 'en' ? 'rotate-180' : ''}`}></i>
              </>
            )}
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 pt-4">
            ليس لديك حساب؟ <button type="button" className="text-pink-500 font-bold hover:underline">سجل الآن</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
