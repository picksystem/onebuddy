import * as yup from 'yup';

export const SignUpSchema = yup.object({
  // ── Personal ────────────────────────────────────────────────────────────────
  firstName: yup
    .string()
    .required('required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('required'),
  phone: yup
    .string()
    .required('required')
    .matches(/^[\d\s+\-()]{7,15}$/, 'Enter a valid phone number'),
  dateOfBirth: yup
    .string()
    .required('required')
    .test('age', 'You must be at least 18 years old', (val) => {
      if (!val) return false;
      const today = new Date();
      const dob = new Date(val);
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      return age > 18 || (age === 18 && m >= 0);
    }),
  gender: yup.string().required('required'),
  city: yup.string().required('required'),

  // ── Work Details ─────────────────────────────────────────────────────────────
  employeeId: yup
    .string()
    .matches(/^\d*$/, 'Employee ID must be numeric')
    .optional(),
  department: yup.string().optional(),
  managerEmail: yup
    .string()
    .email('Invalid email')
    .optional()
    .nullable(),
  reasonForAccess: yup.string().required('required'),
  role: yup
    .string()
    .required('required')
    .oneOf(['consultant', 'admin'], 'Select a valid role'),

  // ── Security ─────────────────────────────────────────────────────────────────
  password: yup
    .string()
    .required('required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/\d/, 'Must contain at least one number'),
  confirmPassword: yup
    .string()
    .required('required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the Terms & Privacy Policy'),
});

export type SignUpDto = yup.InferType<typeof SignUpSchema>;
