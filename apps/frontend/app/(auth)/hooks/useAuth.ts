import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiNexus from '@/lib/api/apiNexusIntercepter';
import DataManager from '@/lib/data-manager';
import { User } from '@/types/auth';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedToken = DataManager.getToken();
    const loadedUser = DataManager.getUser();

    setToken(loadedToken);
    setUser(loadedUser);

    if (loadedToken && !loadedUser) {
      apiNexus
        .call<User>('GET_PROFILE')
        .then((res) => {
          if (res.isSuccess && res.data) {
            setUser(res.data);
            DataManager.setUser(res.data);
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    DataManager.cleanAll();
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    logout,
  };
}

export default useAuth;
