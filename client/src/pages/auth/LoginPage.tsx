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
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
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
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative z-10">
        <div className="w-full max-w-sm space-y-8">
          
          <div className="text-center">
            <div className="mx-auto bg-accent-500 rounded-lg w-12 h-12 flex items-center justify-center mb-6 shadow-md">
              <span className="text-white text-2xl font-bold">m</span>
            </div>
            <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to your HRMagnet account
            </p>
          </div>

          {/* Social login mocks (visual only as per Visily design) */}
          <div className="space-y-3">
            <button type="button" className="w-full flex items-center justify-center gap-2 bg-[#4285F4] text-white rounded-full py-2.5 text-sm font-medium hover:bg-[#3367D6] transition-colors shadow-sm">
              <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign in with Google
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-2 bg-[#00A4EF] text-white rounded-full py-2.5 text-sm font-medium hover:bg-[#008CC9] transition-colors shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 21 21"><path fill="#f3f3f3" d="M0 0h10v10H0z"/><path fill="#f3f3f3" d="M11 0h10v10H11z"/><path fill="#f3f3f3" d="M0 11h10v10H0z"/><path fill="#f3f3f3" d="M11 11h10v10H11z"/></svg>
              Sign in with Microsoft
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 uppercase text-xs font-semibold tracking-wider">Or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work email"
              type="email"
              placeholder="name@company.com"
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

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account? <a href="#" className="text-accent-500 font-semibold hover:underline">Sign up</a>
          </p>
        </div>
      </div>

      {/* Right Decorative Panel (Visily Design) */}
      <div className="hidden lg:flex w-1/2 bg-[#CFFafe] relative overflow-hidden flex-col justify-center items-center">
        {/* Abstract shapes matching the mockup */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent-500 rounded-br-full opacity-90 z-10 flex flex-col justify-center items-center text-center p-8">
            <h3 className="text-navy-900 font-bold text-2xl">Employee</h3>
            <p className="text-navy-800 font-medium">Engagement Hub</p>
            <div className="mt-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
        </div>
        
        <div className="absolute top-0 right-0 w-1/2 h-full bg-navy-900 z-0"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FEE2E2] rounded-bl-full z-10 opacity-80"></div>
        <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-[#6EE7B7] rounded-tl-full z-10 flex items-center justify-center pr-8">
            <div className="text-navy-900 font-bold text-center">
                <div className="text-3xl">Easy</div>
                <div className="text-sm font-medium">to manage</div>
            </div>
        </div>

        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FEE2E2] rounded-tr-full z-10 opacity-90 flex items-center justify-center pb-8 pl-8">
             <div className="text-navy-900 font-bold text-center">
                <div className="text-4xl">7+</div>
                <div className="text-sm font-medium">years experience</div>
            </div>
        </div>

        <div className="absolute bottom-16 right-16 z-20 text-navy-900 font-bold text-right">
            <div className="text-2xl">Automated</div>
            <div className="text-sm font-medium text-navy-800">Workflows</div>
        </div>

        <div className="absolute inset-0 z-20 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      </div>
    </div>
  );
}
