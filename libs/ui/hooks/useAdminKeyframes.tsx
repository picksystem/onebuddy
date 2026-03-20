import GlobalStyles from '@mui/material/GlobalStyles';

/**
 * Returns a <GlobalStyles> element that injects the shared `um-*` CSS keyframes
 * used across admin pages. Render the returned element once at the top of your
 * component tree (e.g. alongside the loading guard).
 */
export const useAdminKeyframes = () => {
  return (
    <GlobalStyles
      styles={`
        @keyframes um-gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes um-orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(22px, -18px) scale(1.06); }
          75%  { transform: translate(-16px, 12px) scale(0.94); }
        }
        @keyframes um-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          40%  { transform: translateY(-18px) rotate(6deg); }
          70%  { transform: translateY(-9px) rotate(-3deg); }
        }
        @keyframes um-slide-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes um-counter {
          from { opacity: 0; transform: scale(0.65) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes um-pulse-live {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px #4ade80; }
          50%  { opacity: 0.55; transform: scale(1.35); box-shadow: 0 0 18px rgba(74,222,128,0.6); }
        }
        @keyframes um-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}
    />
  );
};
