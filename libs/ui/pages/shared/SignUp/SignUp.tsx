import { Box, Typography, Avatar } from '@mui/material';
import { constants } from '@bandi/utils';
import { useStyles } from './styles';
import useSignUp, { STEPS } from './hooks/useSignUp';
import StepProgress from './components/StepProgress';
import PersonalStep from './components/PersonalStep';
import WorkDetailsStep from './components/WorkDetailsStep';
import SecurityStep from './components/SecurityStep';
import LeftPanel from './components/LeftPanel';

import Button from '../../../components/Button/Button';

const SignUp = () => {
  const { classes } = useStyles();
  const {
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
  } = useSignUp();

  const touched = formik.touched as Partial<Record<string, boolean>>;
  const errors = formik.errors as Partial<Record<string, string>>;

  return (
    <Box className={classes.pageWrapper}>
      <LeftPanel classes={classes} onNavigateSignIn={() => navigate(constants.Path.SIGNIN)} />

      <Box className={classes.rightPanel}>
        <Box className={classes.formContainer}>
          <Box className={classes.formHeader}>
            <Avatar className={classes.avatarPreview}>{initials}</Avatar>
            <Box>
              <Typography variant='h5' fontWeight={700} color='text.primary'>
                Create your account
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 0.25 }}>
                Step {step + 1} of {STEPS.length} — {STEPS[step].label}
              </Typography>
            </Box>
          </Box>

          <StepProgress step={step} classes={classes} />

          <form
            onSubmit={(e) => {
              if (step < STEPS.length - 1) {
                e.preventDefault();
                return;
              }
              setStep2Submitted(true);
              formik.handleSubmit(e);
            }}
            noValidate
          >
            {step === 0 && (
              <PersonalStep
                values={{
                  firstName: formik.values.firstName,
                  lastName: formik.values.lastName,
                  email: formik.values.email,
                  phone: formik.values.phone,
                }}
                touched={touched}
                errors={errors}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                classes={classes}
              />
            )}

            {step === 1 && (
              <WorkDetailsStep
                values={{
                  employeeId: formik.values.employeeId,
                  businessUnit: formik.values.businessUnit,
                  reasonForAccess: formik.values.reasonForAccess,
                  role: formik.values.role,
                }}
                touched={touched}
                errors={errors}
                onChange={formik.handleChange}
                onRoleChange={(e) => formik.setFieldValue('role', e.target.value)}
                onBlur={formik.handleBlur}
                classes={classes}
              />
            )}

            {step === 2 && (
              <SecurityStep
                values={{
                  password: formik.values.password,
                  confirmPassword: formik.values.confirmPassword,
                }}
                errors={errors}
                step2Touched={step2Touched}
                step2Submitted={step2Submitted}
                onPasswordChange={formik.handleChange}
                onPasswordBlur={(e) => {
                  setStep2Touched((p) => ({ ...p, password: true }));
                  formik.handleBlur(e);
                }}
                onConfirmChange={formik.handleChange}
                onConfirmBlur={(e) => {
                  setStep2Touched((p) => ({ ...p, confirmPassword: true }));
                  formik.handleBlur(e);
                }}
                classes={classes}
              />
            )}

            <Box className={classes.navRow}>
              {step > 0 ? (
                <Button
                  type='button'
                  variant='outlined'
                  color='secondary'
                  label='Back'
                  onClick={() => setStep((s) => s - 1)}
                />
              ) : (
                <Button
                  type='button'
                  variant='outlined'
                  color='secondary'
                  label='Cancel'
                  onClick={() => {
                    sessionStorage.removeItem('signUpStep');
                    navigate(constants.Path.SIGNIN);
                  }}
                />
              )}
              {step < STEPS.length - 1 ? (
                <Button
                  type='button'
                  variant='contained'
                  color='primary'
                  label='Continue'
                  onClick={handleNext}
                />
              ) : (
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  loading={isLoading}
                  disabled={isLoading || submitted}
                  label='Submit Registration'
                />
              )}
            </Box>
          </form>

          <Box className={classes.mobileSignin}>
            <Typography variant='body2' color='text.secondary'>
              Already have an account?{' '}
              <Typography
                component='span'
                variant='body2'
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={() => navigate(constants.Path.SIGNIN)}
              >
                Sign in
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
