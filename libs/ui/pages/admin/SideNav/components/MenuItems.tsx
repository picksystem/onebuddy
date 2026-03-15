import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import CollectionsIcon from '@mui/icons-material/Collections';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import { constants } from '@bandi/utils';

export interface MenuItem {
  label: string;
  icon: React.ReactElement;
  path: string;
}

export interface MenuGroup {
  group: string;
  items: MenuItem[];
}

export const useMenuItems = (): MenuGroup[] => {
  const { AdminPath } = constants;
  return [
    {
      group: 'Governance',
      items: [
        {
          label: 'Dashboard',
          icon: <DashboardIcon />,
          path: AdminPath.DASHBOARD,
        },
        {
          label: 'Audit Trails',
          icon: <HistoryIcon />,
          path: AdminPath.AUDIT_TRAILS,
        },
        {
          label: 'Events',
          icon: <EventIcon />,
          path: AdminPath.EVENTS,
        },
        {
          label: 'Access Requests',
          icon: <CheckCircleOutlineIcon />,
          path: AdminPath.ACCESS_REQUEST,
        },
      ],
    },
    {
      group: 'People & Organizations',
      items: [
        {
          label: 'Users',
          icon: <PeopleIcon />,
          path: AdminPath.USERS,
        },
        {
          label: 'Captains',
          icon: <DirectionsCarIcon />,
          path: AdminPath.CAPTAINS,
        },
        {
          label: 'User Management',
          icon: <ManageAccountsIcon />,
          path: AdminPath.USER_MANAGEMENT,
        },
        {
          label: 'Organizations',
          icon: <BusinessIcon />,
          path: AdminPath.ORGANIZATIONS,
        },
      ],
    },
    {
      group: 'Platform Content',
      items: [
        {
          label: 'Fast Tag Requests',
          icon: <LocalOfferIcon />,
          path: AdminPath.TAGS,
        },
        {
          label: 'Subscriptions',
          icon: <SubscriptionsIcon />,
          path: AdminPath.SUBSCRIPTIONS,
        },
        {
          label: 'Collections',
          icon: <CollectionsIcon />,
          path: AdminPath.COLLECTIONS,
        },
        {
          label: 'Categories',
          icon: <CategoryIcon />,
          path: AdminPath.CATEGORIES,
        },
      ],
    },
  ];
};
