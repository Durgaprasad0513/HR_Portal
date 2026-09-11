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
      <div className="w-full flex flex-col items-center justify-center p-8 lg:p-24 relative z-10">
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

      
    </div>
  );
}
