import { Typography, ClickAwayListener } from '@mui/material';
import { Box, TextField } from '@bandi/component';
import SearchIcon from '@mui/icons-material/Search';
import { IAuthUser } from '@bandi/interfaces';

const genUserId = (role: string, id: number | string): string => {
  const prefix =
    role === 'admin'
      ? 'ADMIN'
      : role === 'consultant'
        ? 'CONSULT'
        : role === 'captain'
          ? 'CAPTAIN'
          : 'USER';
  const num = Number(String(id).replace('draft_', '')) || 0;
  return `${prefix}${String(num).padStart(5, '0')}`;
};

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickAway: () => void;
  showResults: boolean;
  incidents: IAuthUser[];
  onSelectIncident: (user: IAuthUser) => void;
  className?: string;
  wrapperClassName?: string;
  dropdownClassName?: string;
  noResultsClassName?: string;
}

const SearchBar = ({
  value,
  onChange,
  onClickAway,
  showResults,
  incidents,
  onSelectIncident,
  noResultsClassName,
  className,
  wrapperClassName,
  dropdownClassName,
}: SearchBarProps) => {
  const renderDropdown = () => {
    if (!showResults || value.length < 2) return null;
    return (
      <Box className={dropdownClassName}>
        {incidents.length === 0 ? (
          <Typography className={noResultsClassName}>No users found</Typography>
        ) : (
          incidents.map((user) => {
            const userId = (user as any).customUserId || genUserId(user.role ?? (user as any).requestedRole ?? 'user', user.id);
            return (
              <Box
                key={user.id}
                onClick={() => onSelectIncident(user)}
                sx={{
                  px: 2,
                  py: 1,
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(99,102,241,0.12)' },
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc' }}>
                  {userId}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {user.name || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || '—'}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>
    );
  };

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box className={wrapperClassName}>
        <TextField
          placeholder='Search by User ID...'
          icon={<SearchIcon />}
          iconAlignment='right'
          value={value}
          onChange={onChange}
          className={className}
        />
        {renderDropdown()}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
