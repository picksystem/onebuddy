import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { constants } from '@bandi/utils';

const { AuthPath } = constants;

// ── Feature cards ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '🚗', title: 'Instant Ride',       desc: 'Book a ride in seconds across 7 vehicle types' },
  { icon: '👨‍✈️', title: 'Hire a Driver',    desc: 'Professional driver for your own vehicle, by the day' },
  { icon: '🔑', title: 'Vehicle Rental',     desc: 'Self-drive rentals with flexible hourly / daily bundles' },
  { icon: '📦', title: 'Parcel Delivery',    desc: 'Same-city parcel delivery, tracked in real time' },
  { icon: '🗺️', title: 'Live Tracking',      desc: 'See your ride on the map, every step of the way' },
  { icon: '🔒', title: 'Secure & Private',   desc: 'Your data is encrypted end-to-end with JWT auth' },
];

const STATS = [
  { value: '20+', label: 'Cities' },
  { value: '7',   label: 'Vehicle Types' },
  { value: '5',   label: 'Services' },
  { value: '1',   label: 'Unified App' },
];

const CustomerWelcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8faff', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Nav ──────────────────────────────────────────────────────── */}
      <Box
        component='nav'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 3, md: 6 },
          py: 2,
          background: '#ffffff',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}>
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38, height: 38, borderRadius: '10px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>
            🚀
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e293b', lineHeight: 1 }}>
              OneBuddy
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.08em' }}>
              CUSTOMER PORTAL
            </Typography>
          </Box>
        </Box>

        {/* Nav actions */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant='outlined'
            size='small'
            onClick={() => navigate(AuthPath.SIGNIN)}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: '#2563eb', color: '#2563eb' }}>
            Sign In
          </Button>
          <Button
            variant='contained'
            size='small'
            onClick={() => navigate(AuthPath.SIGNUP)}
            sx={{ borderRadius: 2, fontWeight: 700, background: '#2563eb' }}>
            Get Started
          </Button>
        </Box>
      </Box>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 45%, #1d4ed8 100%)',
          py: { xs: 8, md: 12 },
          px: 4,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
        {/* Decorative orbs */}
        <Box sx={{ position: 'absolute', top: -120, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', pointerEvents: 'none' }} />

        {/* Live badge */}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 20, px: 2, py: 0.5, mb: 3 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', fontWeight: 600 }}>
            Now Live · 20+ Cities across India
          </Typography>
        </Box>

        {/* Headline */}
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            color: '#ffffff',
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            mb: 2.5,
          }}>
          Your City,{' '}
          <Box
            component='span'
            sx={{
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            Your Ride.
          </Box>
        </Typography>

        <Typography
          sx={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 560,
            mx: 'auto',
            lineHeight: 1.7,
            mb: 5,
          }}>
          Rides · Driver Hire · Vehicle Rental · Parcel Delivery.
          One app, every mobility need — web and mobile.
        </Typography>

        {/* CTA buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant='contained'
            size='large'
            onClick={() => navigate(AuthPath.SIGNUP)}
            sx={{
              borderRadius: 3, fontWeight: 700, px: 4, py: 1.5,
              background: '#2563eb',
              boxShadow: '0 4px 20px rgba(37,99,235,0.5)',
              '&:hover': { background: '#1d4ed8' },
            }}>
            Create Free Account
          </Button>
          <Button
            variant='outlined'
            size='large'
            onClick={() => navigate(AuthPath.SIGNIN)}
            sx={{
              borderRadius: 3, fontWeight: 700, px: 4, py: 1.5,
              borderColor: 'rgba(255,255,255,0.4)',
              color: '#ffffff',
              '&:hover': { borderColor: '#fff', background: 'rgba(255,255,255,0.08)' },
            }}>
            Sign In
          </Button>
        </Box>
      </Box>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <Box sx={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.06)', py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 4, md: 8 }, flexWrap: 'wrap', maxWidth: 800, mx: 'auto' }}>
          {STATS.map((s) => (
            <Box key={s.label} sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 900, fontSize: '2rem', color: '#1e3a8a', lineHeight: 1 }}>
                {s.value}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.5, fontWeight: 500 }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <Container maxWidth='lg' sx={{ py: 8 }}>
        <Typography sx={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#2563eb', textTransform: 'uppercase', mb: 1 }}>
          Everything You Need
        </Typography>
        <Typography sx={{ textAlign: 'center', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#0f172a', letterSpacing: '-0.03em', mb: 1 }}>
          One App, All Your Mobility Needs
        </Typography>
        <Typography sx={{ textAlign: 'center', color: '#64748b', fontSize: '1rem', mb: 6, maxWidth: 500, mx: 'auto' }}>
          Book rides, hire drivers, rent vehicles, and send parcels — all from a single platform.
        </Typography>

        <Grid container spacing={3}>
          {FEATURES.map((f) => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <Box
                sx={{
                  background: '#ffffff',
                  borderRadius: 4,
                  p: 3,
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 36px rgba(0,0,0,0.1)' },
                }}>
                <Typography sx={{ fontSize: '2rem', mb: 1.5 }}>{f.icon}</Typography>
                <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>{f.title}</Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          py: 8,
          px: 4,
          textAlign: 'center',
        }}>
        <Typography sx={{ fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#ffffff', letterSpacing: '-0.03em', mb: 2 }}>
          Ready to ride with OneBuddy?
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', mb: 4, maxWidth: 420, mx: 'auto' }}>
          Sign up in under a minute. No credit card required.
        </Typography>
        <Button
          variant='contained'
          size='large'
          onClick={() => navigate(AuthPath.SIGNUP)}
          sx={{
            borderRadius: 3, fontWeight: 700, px: 5, py: 1.5,
            background: '#ffffff', color: '#1e3a8a',
            boxShadow: '0 4px 20px rgba(255,255,255,0.2)',
            '&:hover': { background: '#f1f5f9' },
          }}>
          Get Started — It's Free
        </Button>
      </Box>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Box
        sx={{
          background: '#0f172a',
          py: 3,
          px: { xs: 3, md: 6 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 18 }}>🚀</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>OneBuddy</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>Customer Portal · Port 1800</Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
          © 2025 OneBuddy. All rights reserved.
        </Typography>
      </Box>

    </Box>
  );
};

export default CustomerWelcome;
