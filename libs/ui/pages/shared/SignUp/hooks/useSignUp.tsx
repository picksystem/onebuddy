import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormWithSessionStorage, useNotification } from '@bandi/hooks';
import { SignUpSchema } from '@bandi/interfaces';
import { constants } from '@bandi/utils';
import { useAuthActionMutation } from '@bandi/services';


export const STEPS = [
  { label: 'Personal', fields: ['firstName', 'lastName', 'email', 'phone'] },
  {
    label: 'Work Details',
    fields: [
      'employeeId',
      'businessUnit',
      'reasonForAccess',
      'role',
    ],
  },
  { label: 'Security', fields: ['password', 'confirmPassword'] },
];

const useSignUp = () => {
  const navigate = useNavigate();
  const [authAction, { isLoading }] = useAuthActionMutation();
  const notify = useNotification();
  const [submitted, setSubmitted] = useState(false);
  const [step2Touched, setStep2Touched] = useState({ password: false, confirmPassword: false });
  const [step2Submitted, setStep2Submitted] = useState(false);
  const [step, setStep] = useState(() => {
    try {
      const saved = sessionStorage.getItem('signUpStep');
      return saved !== null ? Math.min(parseInt(saved, 10), STEPS.length - 1) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('signUpStep', String(step));
    } catch {
      /* ignore */
    }
  }, [step]);

  const formik = useFormWithSessionStorage('signUp', {
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      reasonForAccess: '',
      employeeId: '',
      businessUnit: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      try {
        const result = await authAction({ action: 'signup', ...values }).unwrap();
        const redirectDelay = 2000;
        notify.success(result.message, redirectDelay);
        setSubmitted(true);
        sessionStorage.removeItem('signUpStep');
        setTimeout(() => navigate(constants.Path.SIGNIN, { replace: true }), redirectDelay);
      } catch (err: unknown) {
        const error = err as { data?: { message?: string }; message?: string };
        notify.error(error?.data?.message || error?.message || 'Sign up failed');
      }
    },
  });

  const handleNext = async () => {
    const { fields } = STEPS[step];
    const nextStep = step + 1;
    const touches = fields.reduce<Record<string, boolean>>((acc, f) => ({ ...acc, [f]: true }), {});
    formik.setTouched({ ...formik.touched, ...touches }, false);
    const errors = await formik.validateForm();
    const hasError = fields.some((f) => (errors as Record<string, unknown>)[f]);
    if (!hasError) {
      setStep2Touched({ password: false, confirmPassword: false });
      setStep2Submitted(false);
      setStep(() => nextStep);
    }
  };

  const initials =
    [formik.values.firstName?.[0], formik.values.lastName?.[0]]
      .filter(Boolean)
      .join('')
      .toUpperCase() || '?';

  return {
    formik,
    isLoading,
    submitted,
    step,
    setStep,
    step2Touched,
    setStep2Touched,
    step2Submitted,
    setStep2Submitted,
    handleNext,
    initials,
    navigate,
  };
};

export default useSignUp;
