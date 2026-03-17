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
  'People & Organizations': {
    gradient: 'linear-gradient(90deg, rgba(14,165,233,0.18) 0%, rgba(14,165,233,0.04) 100%)',
    labelColor: '#7dd3fc',
    border: 'rgba(14,165,233,0.55)',
    glowColor: 'rgba(14,165,233,0.25)',
    dotColor: '#0ea5e9',
  },
  'Platform Content': {
    gradient: 'linear-gradient(90deg, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.04) 100%)',
    labelColor: '#fcd34d',
    border: 'rgba(245,158,11,0.55)',
    glowColor: 'rgba(245,158,11,0.25)',
    dotColor: '#f59e0b',
  },
  'Mobility Services': {
    gradient: 'linear-gradient(90deg, rgba(139,92,246,0.22) 0%, rgba(139,92,246,0.05) 100%)',
    labelColor: '#c4b5fd',
    border: 'rgba(139,92,246,0.55)',
    glowColor: 'rgba(139,92,246,0.3)',
    dotColor: '#8b5cf6',
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
      <Box className={classes.navScrollArea}>
        <List className={classes.navList}>
          {menuGroups.map((group, groupIdx) => {
            const cfg = GROUP_CONFIG[group.group] ?? GROUP_CONFIG['Governance'];

            return (
              <Box key={group.group} className={classes.navGroupBox}>
                {/* ── Section Header (expanded) ── */}
                {!collapsed ? (
                  <Box
                    className={classes.sectionHeaderExpanded}
                    sx={{
                      mt: groupIdx === 0 ? 1 : 2.5,
                      mb: '15px',
                      background: cfg.gradient,
                      borderLeft: `3px solid ${cfg.border}`,
                      boxShadow: `0 2px 12px ${cfg.glowColor}`,
                    }}
                  >
                    {/* Glowing dot */}
                    <Box
                      className={classes.sectionGroupDot}
                      sx={{
                        background: cfg.dotColor,
                        boxShadow: `0 0 8px ${cfg.dotColor}, 0 0 14px ${cfg.dotColor}88`,
                      }}
                    />
                    <Typography
                      className={classes.sectionGroupLabel}
                      sx={{
                        color: cfg.labelColor,
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
                      className={classes.sectionDividerCollapsed}
                      sx={{
                        mt: groupIdx === 0 ? 1 : 2,
                        mb: 0.75,
                        background: `linear-gradient(90deg, ${cfg.border}, transparent)`,
                        boxShadow: `0 0 8px ${cfg.glowColor}`,
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
