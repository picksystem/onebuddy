import { Menu, MenuItem, Divider, Avatar, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { IAuthUser } from '@bandi/interfaces';

interface NotificationsMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onViewAll: () => void;
  onItemClick: (user: IAuthUser) => void;
  notifications: IAuthUser[];
}

const NotificationsMenu = ({
  anchorEl,
  onClose,
  onViewAll,
  onItemClick,
  notifications,
}: NotificationsMenuProps) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    slotProps={{ paper: { sx: { minWidth: 320, maxHeight: 400 } } }}
  >
    <MenuItem disabled sx={{ opacity: '1 !important' }}>
      <ListItemText
        primary={`Notifications (${notifications.length})`}
        primaryTypographyProps={{ fontWeight: 600 }}
      />
    </MenuItem>
    <Divider />
    {notifications.length > 0 ? (
      notifications.map((u) => (
        <MenuItem key={u.id} onClick={() => onItemClick(u)}>
          <ListItemIcon>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.8rem',
                bgcolor: u.requestedRole === 'admin' ? '#6366f1' : '#0ea5e9',
              }}
            >
              {(u.name || `${u.firstName || ''} ${u.lastName || ''}`)
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary={u.name || `${u.firstName} ${u.lastName}`}
            secondary={`${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}`}
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
          <Chip
            label={u.requestedRole === 'admin' ? 'Admin' : 'Consultant'}
            size='small'
            sx={{
              ml: 1,
              fontSize: '0.65rem',
              height: 20,
              bgcolor: u.requestedRole === 'admin' ? '#ede9fe' : '#e0f2fe',
              color: u.requestedRole === 'admin' ? '#6366f1' : '#0284c7',
              fontWeight: 600,
            }}
          />
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>
        <ListItemText
          primary='No pending requests'
          primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.secondary' }}
        />
      </MenuItem>
    )}
    <Divider />
    <MenuItem onClick={onViewAll}>
      <ListItemText
        primary='View All Access Management'
        primaryTypographyProps={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'primary.main',
          textAlign: 'center',
        }}
      />
    </MenuItem>
  </Menu>
);

export default NotificationsMenu;
