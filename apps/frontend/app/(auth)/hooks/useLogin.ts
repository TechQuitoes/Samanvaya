import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import apiNexus from '@/lib/api/apiNexusIntercepter';
import DataManager from '@/lib/data-manager';
import { AuthResponse } from '@/types/auth';

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPendingApproval(false);
    setIsRejected(false);

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      const msg = 'Please enter a valid email address.';
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!password) {
      const msg = 'Please enter your password.';
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiNexus.call<AuthResponse>('POST_LOGIN', {
        payload: { email, password },
      });

      if (!response.isSuccess || !response.data) {
        const rawMessage = response.message || (response.data as any)?.message || 'Login failed. Please check your credentials.';
        const errorMessage = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage;
        throw new Error(errorMessage);
      }

      const resData = response.data;
      if (resData.accessToken) {
        DataManager.setToken(resData.accessToken);
        DataManager.setUser(resData.user);
      }

      toast.success(resData.message || 'Login successful!');
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);

      if (errorMessage.toLowerCase().includes('pending')) {
        setIsPendingApproval(true);
        toast.warning('Account Pending Approval', {
          description: errorMessage,
          duration: 6000,
        });
      } else if (errorMessage.toLowerCase().includes('rejected')) {
        setIsRejected(true);
        toast.error('Account Rejected', {
          description: errorMessage,
          duration: 6000,
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    setError,
    isPendingApproval,
    isRejected,
    handleSubmit,
  };
}

export default useLogin;
