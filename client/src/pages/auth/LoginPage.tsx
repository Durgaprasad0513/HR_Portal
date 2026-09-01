import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Briefcase } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
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
    <div className="min-h-screen flex bg-white dark:bg-gray-900 font-sans">
      {/* Left Form Panel */}
      <div className="w-full lg:w-2/3 flex flex-col items-center justify-center p-8 lg:p-24 relative z-10">
        <div className="w-full max-w-sm space-y-8">
          
          <div className="text-center">
            <div className="mx-auto bg-accent-500 rounded-lg w-12 h-12 flex items-center justify-center mb-6 shadow-md">
              <Briefcase className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">
              Sign in to your HR Management account
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="email"
              placeholder="Enter your username or email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <Button 
              type="submit" 
              className="w-full mt-2 text-base font-semibold py-2.5" 
              isLoading={isLoading}
            >
              Continue
            </Button>
          </form>
        </div>
      </div>

      {/* Right Decorative Panel (Visily Design Adjusted) */}
      <div className="hidden lg:flex w-1/3 bg-[#e0f7fa] relative overflow-hidden flex-col justify-center items-center">
        {/* Top-left Orange Shape */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#f97316] rounded-br-[150px] opacity-95 z-10 flex flex-col justify-center items-center text-center p-8">
            <h3 className="text-navy-900 dark:text-white font-bold text-3xl">Employee</h3>
            <p className="text-navy-800 font-semibold mt-1">Engagement Hub</p>
            <div className="mt-6 w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-[#f97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
        </div>
        
        {/* Bottom-left Pink Shape */}
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fce7f3] rounded-tr-[150px] rounded-br-none z-10 opacity-95 flex items-center justify-center p-8">
             <div className="text-navy-900 dark:text-white text-center mt-12 ml-6 mr-6">
                <div className="text-xl font-extrabold text-navy-900 dark:text-white leading-tight">Empowering Teams</div>
                <div className="text-sm font-medium text-navy-800 mt-2">Your all-in-one platform for modern HR management and seamless workflows.</div>
            </div>
        </div>
      </div>
    </div>
  );
}
