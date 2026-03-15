import { Typography } from '@mui/material';
import { Box } from '@bandi/component';

interface LogoMarkProps {
  compact?: boolean;
}

const STATIC_COLORS = {
  G: '#fbbf24',
  d: '#60a5fa',
  I: '#c084fc',
};

/**
 * Front-view car headlight icon.
 * Looks like one headlight unit seen head-on:
 *   - dark angular housing
 *   - circular projector lens with halo ring
 *   - DRL strip along the top edge
 */
const HeadlightIcon = ({ size }: { size: number }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      lineHeight: 0,
      marginTop: '4px',
      '@keyframes lightOn': {
        '0%, 100%': {
          filter:
            'drop-shadow(0 0 4px #ffe566) drop-shadow(0 0 10px #ffb800) drop-shadow(0 0 20px #ffe56688)',
          opacity: 1,
        },
        '50%': {
          filter:
            'drop-shadow(0 0 8px #fff5a0) drop-shadow(0 0 18px #ffe566) drop-shadow(0 0 36px #ffb800cc)',
          opacity: 0.88,
        },
      },
      animation: 'lightOn 1.8s ease-in-out infinite',
    }}
  >
    <svg
      width={size * 1.4}
      height={size}
      viewBox='0 0 28 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <radialGradient id='projGrad' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffffff' stopOpacity='1' />
          <stop offset='40%' stopColor='#fff8d6' stopOpacity='1' />
          <stop offset='100%' stopColor='#ffe566' stopOpacity='0.9' />
        </radialGradient>
        <radialGradient id='housingGrad' cx='50%' cy='30%' r='70%'>
          <stop offset='0%' stopColor='#2a2a4a' />
          <stop offset='100%' stopColor='#0d0d1e' />
        </radialGradient>
      </defs>

      {/* Outer housing — angular modern headlight shape */}
      <path
        d='M2 4 Q2 2 4.5 2 L22 2 Q26 2 26 6 L26 14 Q26 18 22 18 L5 18 Q2 18 2 15 Z'
        fill='url(#housingGrad)'
        stroke='#3a3a5a'
        strokeWidth='0.7'
      />

      {/* DRL strip — thin bright line along top inner edge */}
      <path
        d='M5 4.5 Q5 3.5 6 3.5 L21 3.5 Q24.5 3.5 24.5 6'
        fill='none'
        stroke='#ffffff'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeOpacity='0.85'
      />

      {/* Halo ring around projector */}
      <circle
        cx='14'
        cy='11'
        r='5.8'
        fill='none'
        stroke='#ffe566'
        strokeWidth='1.2'
        strokeOpacity='0.7'
      />

      {/* Projector lens */}
      <circle cx='14' cy='11' r='4.2' fill='url(#projGrad)' />

      {/* Inner specular reflection */}
      <circle cx='12.5' cy='9.5' r='1.3' fill='white' fillOpacity='0.9' />

      {/* Bottom chrome trim */}
      <line
        x1='4'
        y1='16.5'
        x2='24'
        y2='16.5'
        stroke='#5a5a7a'
        strokeWidth='0.8'
        strokeLinecap='round'
        strokeOpacity='0.6'
      />
    </svg>
  </Box>
);

const LogoMark = ({ compact = false }: LogoMarkProps) => {
  const iconSize = compact ? 14 : 18;
  const textSize = compact ? '1.1rem' : '1.4rem';
  const textSx = {
    fontWeight: 900,
    fontSize: textSize,
    lineHeight: 1,
    letterSpacing: '0.04em',
    fontFamily: '"Segoe UI Black","Segoe UI","Helvetica Neue",Arial,sans-serif',
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: compact ? 0.875 : 1.25, flexShrink: 0 }}>
      {/* Icon badge */}
      <Box
        sx={{
          width: compact ? 30 : 40,
          height: compact ? 30 : 40,
          borderRadius: compact ? '8px' : '11px',
          background: 'linear-gradient(145deg, #6d28d9 0%, #2563eb 35%, #059669 70%, #d97706 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          boxShadow:
            '0 0 0 1.5px rgba(255,255,255,0.22), 0 4px 18px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '48%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
            borderRadius: compact ? '8px 8px 0 0' : '11px 11px 0 0',
            zIndex: 0,
          }}
        />
        <svg
          width={compact ? 16 : 22}
          height={compact ? 16 : 22}
          viewBox='0 0 24 24'
          fill='none'
          style={{
            position: 'relative',
            zIndex: 1,
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))',
          }}
        >
          <path
            d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'
            fill='rgba(255,255,255,0.2)'
            stroke='white'
            strokeWidth='1.4'
            strokeLinejoin='round'
          />
          <circle cx='12' cy='9' r='2.5' fill='white' />
        </svg>
      </Box>

      {/* Wordmark: G [headlight] [headlight] d I */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: compact ? '1px' : '2px',
            overflow: 'visible',
          }}
        >
          {/* G */}
          <Typography
            component='span'
            sx={{
              ...textSx,
              color: STATIC_COLORS.G,
              textShadow: `0 0 10px ${STATIC_COLORS.G}66, 0 1px 3px rgba(0,0,0,0.2)`,
            }}
          >
            G
          </Typography>

          {/* aa → two front-view headlight icons */}
          <HeadlightIcon size={iconSize} />
          <HeadlightIcon size={iconSize} />

          {/* d */}
          <Typography
            component='span'
            sx={{
              ...textSx,
              color: STATIC_COLORS.d,
              textShadow: `0 0 10px ${STATIC_COLORS.d}66, 0 1px 3px rgba(0,0,0,0.2)`,
            }}
          >
            d
          </Typography>

          {/* I */}
          <Typography
            component='span'
            sx={{
              ...textSx,
              color: STATIC_COLORS.I,
              textShadow: `0 0 10px ${STATIC_COLORS.I}66, 0 1px 3px rgba(0,0,0,0.2)`,
            }}
          >
            I
          </Typography>
        </Box>

        {!compact && (
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '0.42rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontWeight: 700,
              lineHeight: 1,
              marginTop: '4px',
            }}
          >
            Travel Platform
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LogoMark;
