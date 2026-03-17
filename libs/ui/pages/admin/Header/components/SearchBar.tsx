import { Typography, ClickAwayListener } from '@mui/material';
import { Box, TextField } from '@bandi/component';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickAway: () => void;
  showResults: boolean;
  incidents: never[];
  onSelectIncident: () => void;
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
  noResultsClassName,
  className,
  wrapperClassName,
  dropdownClassName,
}: SearchBarProps) => {
  const renderDropdown = () => {
    if (!showResults || value.length < 2) return null;
    return (
      <Box className={dropdownClassName}>
        {incidents.length === 0 && (
          <Typography className={noResultsClassName}>No tickets found</Typography>
        )}
      </Box>
    );
  };

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box className={wrapperClassName}>
        <TextField
          placeholder='Ticket Number'
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
