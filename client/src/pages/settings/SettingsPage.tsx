import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { authApi } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (currentPassword === newPassword) {
      toast.error('Choose a password different from your current one');
      return;
    }

    setIsSaving(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      logout();
      toast.success('Password changed. Please sign in again.');
      navigate('/login', { replace: true });
    } catch (error) {
      const message = (error as AxiosError<{ message?: string }>).response?.data?.message;
      toast.error(message || 'Could not change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="System Settings" description="Manage your account security." />
      <section className="max-w-2xl rounded-2xl border border-slate-border bg-surface p-6 shadow-sm" aria-labelledby="password-heading">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-tint p-3 text-brand-primary"><LockKeyhole className="h-5 w-5" /></div>
          <div>
            <h2 id="password-heading" className="text-lg font-semibold text-text-heading">Change password</h2>
            <p className="text-sm text-text-muted">Update the password for {user?.email || 'your account'}. You will need to sign in again afterward.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Current password" type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          <Input label="New password" type="password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          <Input label="Confirm new password" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          <p className="text-sm text-text-muted">Use at least 8 characters. Changing your password signs out all active sessions.</p>
          <Button type="submit" isLoading={isSaving} disabled={!currentPassword || newPassword.length < 8 || confirmPassword.length < 8}>
            Save password
          </Button>
        </form>
      </section>
    </div>
  );
}
