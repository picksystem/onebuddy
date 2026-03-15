import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link, useLocation } from 'react-router-dom';
import { useStyles } from './styles';
import { useMenuItems } from './components/MenuItems';
import { Tooltip } from '../../../components';
import { useCollapse } from '@bandi/hooks';

// Accent config per group
const GROUP_CONFIG: Record<
  string,
  {
    gradient: string;
    labelColor: string;
    border: string;
    glowColor: string;
    dotColor: string;
  }
> = {
  Governance: {
    gradient: 'linear-gradient(90deg, rgba(99,102,241,0.22) 0%, rgba(99,102,241,0.05) 100%)',
    labelColor: '#a5b4fc',
    border: 'rgba(99,102,241,0.55)',
    glowColor: 'rgba(99,102,241,0.3)',
    dotColor: '#6366f1',
  },
  Administration: {
    gradient: 'linear-gradient(90deg, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.04) 100%)',
    labelColor: '#6ee7b7',
    border: 'rgba(16,185,129,0.55)',
    glowColor: 'rgba(16,185,129,0.25)',
    dotColor: '#10b981',
  },
};

const SideNav = () => {
  const { cx, classes } = useStyles();
  const menuGroups = useMenuItems();
  const { collapsed, toggleCollapse } = useCollapse();
  const location = useLocation();

  return (
    <Drawer
      variant='permanent'
      className={cx(classes.drawer, collapsed ? classes.drawerCollapsed : '')}
    >
      {/* Collapse toggle */}
      <Box className={collapsed ? classes.toggleButtonCenter : classes.toggleButtonRight}>
        <IconButton onClick={toggleCollapse}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Scrollable nav area */}
      <Box
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden',
          flex: 1,
          pb: 2,
          '&::-webkit-scrollbar': { width: 3 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(99,102,241,0.3)',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(99,102,241,0.55)' },
        }}
      >
        <List sx={{ padding: 0, width: '100%' }}>
          {menuGroups.map((group, groupIdx) => {
            const cfg = GROUP_CONFIG[group.group] ?? GROUP_CONFIG['Governance'];

            return (
              <Box key={group.group} sx={{ mb: 0.5 }}>
                {/* ── Section Header (expanded) ── */}
                {!collapsed ? (
                  <Box
                    sx={{
                      mx: 0.75,
                      mt: groupIdx === 0 ? 1 : 2.5,
                      mb: '15px',
                      px: 1.5,
                      py: 0.9,
                      borderRadius: '10px',
                      background: cfg.gradient,
                      borderLeft: `3px solid ${cfg.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      boxShadow: `0 2px 12px ${cfg.glowColor}`,
                    }}
                  >
                    {/* Glowing dot */}
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: cfg.dotColor,
                        boxShadow: `0 0 8px ${cfg.dotColor}, 0 0 14px ${cfg.dotColor}88`,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: cfg.labelColor,
                        userSelect: 'none',
                        lineHeight: 1,
                        textShadow: `0 0 12px ${cfg.labelColor}88`,
                      }}
                    >
                      {group.group}
                    </Typography>
                  </Box>
                ) : (
                  /* Collapsed — short glowing pill divider */
                  <Tooltip title={group.group} placement='right' arrow>
                    <Box
                      sx={{
                        mx: 'auto',
                        mt: groupIdx === 0 ? 1 : 2,
                        mb: 0.75,
                        width: 28,
                        height: 3,
                        borderRadius: 8,
                        background: `linear-gradient(90deg, ${cfg.border}, transparent)`,
                        boxShadow: `0 0 8px ${cfg.glowColor}`,
                        cursor: 'default',
                      }}
                    />
                  </Tooltip>
                )}

                {/* ── Nav Items ── */}
                {group.items.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(`${item.path}/`));

                  return (
                    <Tooltip
                      key={item.label}
                      title={collapsed ? item.label : ''}
                      placement='right'
                      arrow
                    >
                      <Box>
                        <ListItem
                          component={item.path ? Link : 'div'}
                          to={item.path || ''}
                          className={cx(classes.listItem, isActive ? classes.activeItem : '')}
                        >
                          <ListItemIcon
                            className={cx(
                              classes.icon,
                              collapsed ? classes.iconMarginCollapsed : classes.iconMarginExpanded,
                            )}
                          >
                            {item.icon}
                          </ListItemIcon>

                          {!collapsed && (
                            <ListItemText primary={item.label} className={classes.text} />
                          )}
                        </ListItem>
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideNav;
