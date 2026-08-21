import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import apiNexus from '@/lib/api/apiNexusIntercepter';
import DataManager from '@/lib/data-manager';
import { AuthResponse, GoogleAuthResponse } from '@/types/auth';

/** Type guard: check if response is a successful login (has accessToken) */
function isLoginResponse(res: GoogleAuthResponse): res is AuthResponse {
  return 'accessToken' in res && !!res.accessToken;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: (momentListener?: (moment: any) => void) => void;
          cancel: () => void;
        };
      };
    };
    __gsiInitialized?: boolean;
    __gsiCallbacks?: Set<(response: { credential: string }) => void>;
  }
}

interface UseGoogleAuthReturn {
  /** Trigger Google sign-in popup programmatically */
  triggerGoogleAuth: () => void;
  /** Hidden button ref to render native GSI button for reliable click trigger */
  hiddenButtonRef: React.RefObject<HTMLDivElement | null>;
  /** Loading state while auth is in progress */
  isLoading: boolean;
  /** Error message if something went wrong */
  error: string | null;
  /** Whether the user just signed up and is pending admin approval */
  isPendingApproval: boolean;
  /** Whether the user's account was rejected */
  isRejected: boolean;
  /** Clear error/approval states */
  resetState: () => void;
  /** Whether the Google SDK has loaded */
  isGoogleReady: boolean;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export function useGoogleAuth(): UseGoogleAuthReturn {
  const router = useRouter();
  const hiddenButtonRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  const resetState = useCallback(() => {
    setError(null);
    setIsPendingApproval(false);
    setIsRejected(false);
  }, []);

  /**
   * Handle the Google credential response.
   * Sends the ID token to our backend for verification + upsert.
   */
  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      resetState();
      setIsLoading(true);

      try {
        const apiResponse = await apiNexus.call<GoogleAuthResponse>(
          'POST_GOOGLE_AUTH',
          { payload: { credential: response.credential } },
        );

        if (!apiResponse.isSuccess || !apiResponse.data) {
          const rawMessage =
            apiResponse.message ||
            (apiResponse.data as any)?.message ||
            'Google authentication failed.';
          const errorMessage = Array.isArray(rawMessage)
            ? rawMessage.join(', ')
            : rawMessage;
          throw new Error(errorMessage);
        }

        const resData = apiResponse.data;

        // Case 1: Successful login (approved user)
        if (isLoginResponse(resData)) {
          DataManager.setToken(resData.accessToken);
          DataManager.setUser(resData.user);
          toast.success(resData.message || 'Login successful!');
          router.push('/dashboard');
          return;
        }

        // Case 2: New signup — pending approval
        if ('requiresApproval' in resData && resData.requiresApproval) {
          setIsPendingApproval(true);
          toast.info(
            resData.message || 'Account created! Pending admin approval.',
          );
          return;
        }
      } catch (err: any) {
        const errorMessage =
          err.message || 'Google authentication failed. Please try again.';
        setError(errorMessage);

        // Detect pending approval or rejection from error messages
        if (errorMessage.toLowerCase().includes('pending')) {
          setIsPendingApproval(true);
        } else if (errorMessage.toLowerCase().includes('rejected')) {
          setIsRejected(true);
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router, resetState],
  );

  /**
   * Load and initialize the Google Identity Services SDK once (Singleton).
   */
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    if (!window.__gsiCallbacks) {
      window.__gsiCallbacks = new Set();
    }
    window.__gsiCallbacks.add(handleCredentialResponse);

    const initGsi = () => {
      if (!window.google?.accounts?.id) return;

      if (!window.__gsiInitialized) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (res: { credential: string }) => {
            window.__gsiCallbacks?.forEach((cb) => cb(res));
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false,
        });
        window.__gsiInitialized = true;
      }

      // Render native button in hidden ref if available
      if (hiddenButtonRef.current && window.google?.accounts?.id) {
        window.google.accounts.id.renderButton(hiddenButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
        });
      }

      setIsGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      let script = document.getElementById('google-gsi-script') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initGsi;
        script.onerror = () => {
          setError('Failed to load Google Sign-In.');
        };
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', initGsi);
      }
    }

    return () => {
      window.__gsiCallbacks?.delete(handleCredentialResponse);
    };
  }, [handleCredentialResponse]);

  /**
   * Trigger Google sign-in popup programmatically.
   */
  const triggerGoogleAuth = useCallback(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Sign-In is not configured.');
      toast.error('Google Sign-In is not configured.');
      return;
    }

    resetState();

    // Priority 1: Trigger the native rendered button click inside the hidden ref
    if (hiddenButtonRef.current) {
      const nativeButton = hiddenButtonRef.current.querySelector<HTMLElement>('div[role="button"]');
      if (nativeButton) {
        nativeButton.click();
        return;
      }
    }

    // Priority 2: Fallback to prompt()
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.warn('[GSI] Prompt not displayed reason:', notification.getNotDisplayedReason());
        }
      });
    }
  }, [resetState]);

  return {
    triggerGoogleAuth,
    hiddenButtonRef,
    isLoading,
    error,
    isPendingApproval,
    isRejected,
    resetState,
    isGoogleReady,
  };
}
