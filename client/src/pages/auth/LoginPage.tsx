import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center pt-8 pb-4">
          <div className="mx-auto bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </CardTitle>
          <p className="text-sm text-slate-500">
            Enter your credentials to access the HR portal
          </p>
        </CardHeader>
        <CardContent className="pb-8 px-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2" 
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
