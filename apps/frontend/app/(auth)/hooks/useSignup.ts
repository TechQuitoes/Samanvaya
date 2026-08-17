import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import apiNexus from '@/lib/api/apiNexusIntercepter';
import { SignupResponse, UserRole } from '@/types/auth';

export interface SignupFormData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  templeName: string;
  templeLocation: string;
  role: UserRole | string;
}

const initialFormData: SignupFormData = {
  fullName: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  templeName: '',
  templeLocation: '',
  role: UserRole.VIEWER,
};

export function useSignup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (fields: Partial<SignupFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const clearFieldError = (fieldName: string) => {
    setFieldErrors((prev) => {
      if (!prev[fieldName]) return prev;
      const copy = { ...prev };
      delete copy[fieldName];
      return copy;
    });
  };

  const validateStep = (step: number): boolean => {
    setError(null);
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full Name is required.';
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = 'Name must be at least 2 characters.';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }

      if (!formData.mobile.trim()) {
        newErrors.mobile = 'Mobile number is required.';
      } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required.';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long.';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password.';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    } else if (step === 2) {
      if (!formData.templeName.trim()) {
        newErrors.templeName = 'Temple / Center Name is required.';
      }
    } else if (step === 3) {
      if (!formData.role) {
        newErrors.role = 'Please select your role.';
      }
    }

    setFieldErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      setError(firstError);
      return false;
    }

    // Unlock next step upon successful validation
    setMaxUnlockedStep((prev) => Math.max(prev, step + 1));
    return true;
  };

  const goToStep = (targetStep: number) => {
    if (targetStep > maxUnlockedStep) {
      toast.warning('Please complete the current step first to unlock next steps.');
      return;
    }
    setError(null);
    setCurrentStep(targetStep);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxUnlockedStep((prev) => Math.max(prev, nextStep));
    } else {
      submitSignup();
    }
  };

  const submitSignup = async () => {
    // Validate all steps prior to submission
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error('Please fix the errors in previous steps before submitting.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiNexus.call<SignupResponse>('POST_SIGNUP', {
        payload: {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
          role: formData.role,
        },
      });

      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || 'Signup failed. Please try again.');
      }

      const resData = response.data;

      toast.success(resData.message || 'Account created successfully!', {
        description: 'Your account is pending admin approval. You will be able to login once approved.',
        duration: 5000,
      });

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    maxUnlockedStep,
    goToStep,
    formData,
    updateFormData,
    fieldErrors,
    clearFieldError,
    isLoading,
    error,
    handleNextStep,
    submitSignup,
  };
}

export default useSignup;
