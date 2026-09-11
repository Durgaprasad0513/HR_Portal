import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/api/auth';
import toast from 'react-hot-toast';
import { User, Lock, ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (!username || !password) {
      setErrorMsg('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    try {
      // API currently uses 'email' field in payload, map username -> email
      const response = await authApi.login({ email: username, password });
      if (response.success) {
        login(response.data.token, response.data.user);
        toast.success('Login successful');
        navigate('/dashboard');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-[#1e3a8a] to-black p-4 overflow-hidden relative">
      {/* Decorative blurred background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-blue-500 rounded-full mix-blend-screen filter blur-[128px] opacity-40"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-800 rounded-full mix-blend-screen filter blur-[128px] opacity-40"></div>

      <div className="w-full max-w-[420px] backdrop-blur-xl bg-white/[0.08] border border-white/20 rounded-[2rem] p-10 shadow-2xl relative z-10 text-white">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-white drop-shadow-sm">Welcome Back</h1>
          <p className="text-white/70 text-sm">Sign in to your HR Management account</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg text-sm text-center mb-6 backdrop-blur-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-white/30 text-white placeholder:text-white/60 py-3 pl-9 pr-4 focus:outline-none focus:border-blue-400 transition-colors"
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/30 text-white placeholder:text-white/60 py-3 pl-9 pr-4 focus:outline-none focus:border-blue-400 transition-colors"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 transition-transform duration-200 shadow-lg hover:shadow-blue-500/30"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
