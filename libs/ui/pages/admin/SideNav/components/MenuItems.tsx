import DashboardIcon from '@mui/icons-material/Dashboard';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CategoryIcon from '@mui/icons-material/Category';
import TollIcon from '@mui/icons-material/Toll';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CommuteIcon from '@mui/icons-material/Commute';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PercentIcon from '@mui/icons-material/Percent';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import RuleIcon from '@mui/icons-material/Rule';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import MapIcon from '@mui/icons-material/Map';
import ExtensionIcon from '@mui/icons-material/Extension';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
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
      group: 'Overview',
      items: [{ label: 'Dashboard', icon: <DashboardIcon />, path: AdminPath.DASHBOARD }],
    },
    {
      group: 'Team Access',
      items: [
        { label: 'Access Requests', icon: <AssignmentIndIcon />, path: AdminPath.ROLE_REQUESTS },
        { label: 'Access Management', icon: <VpnKeyIcon />, path: AdminPath.ACCESS_MANAGEMENT },
      ],
    },
    {
      group: 'People Access',
      items: [
        {
          label: 'Customer Access',
          icon: <HowToRegIcon />,
          path: AdminPath.CUSTOMER_APPROVALS,
        },
        {
          label: 'Mobility Access',
          icon: <DirectionsCarIcon />,
          path: AdminPath.MOBILITY_ACCESS,
        },
        {
          label: 'Logistics Access',
          icon: <Inventory2Icon />,
          path: AdminPath.LOGISTICS_ACCESS,
        },
        {
          label: 'User Access',
          icon: <PersonSearchIcon />,
          path: AdminPath.USER_ACCESS,
        },
        {
          label: 'Customer Management',
          icon: <VerifiedUserIcon />,
          path: AdminPath.USER_MANAGEMENT,
        },
        {
          label: 'Mobility Management',
          icon: <CommuteIcon />,
          path: AdminPath.MOBILITY_MANAGEMENT,
        },
        {
          label: 'Logistics Management',
          icon: <LocalShippingIcon />,
          path: AdminPath.LOGISTICS_MANAGEMENT,
        },
        {
          label: 'User Management',
          icon: <ManageAccountsIcon />,
          path: AdminPath.USER_MGMT,
        },
      ],
    },
    {
      group: 'Finance',
      items: [
        { label: 'Transactions', icon: <PaymentsIcon />, path: AdminPath.TRANSACTIONS },
        {
          label: 'Collections',
          icon: <AccountBalanceWalletIcon />,
          path: AdminPath.DRIVER_EARNINGS,
        },
        { label: 'Commissions', icon: <PercentIcon />, path: AdminPath.COMMISSIONS },
        { label: 'Subscriptions', icon: <CardMembershipIcon />, path: AdminPath.SUBSCRIPTIONS },
        { label: 'Fast Tag Requests', icon: <TollIcon />, path: AdminPath.TAGS },
      ],
    },
    {
      group: 'Reports',
      items: [
        { label: 'Analytics', icon: <QueryStatsIcon />, path: AdminPath.ANALYTICS },
        { label: 'Activity Logs', icon: <CalendarMonthIcon />, path: AdminPath.EVENTS },
        { label: 'Audit Logs', icon: <ManageSearchIcon />, path: AdminPath.AUDIT_TRAILS },
      ],
    },
    {
      group: 'Configuration',
      items: [
        { label: 'Service Types', icon: <MiscellaneousServicesIcon />, path: AdminPath.SERVICES },
        { label: 'Pricing Rules', icon: <PriceChangeIcon />, path: AdminPath.PRICING },
        { label: 'Categories', icon: <CategoryIcon />, path: AdminPath.CATEGORIES },
        { label: 'Business Rules', icon: <RuleIcon />, path: AdminPath.RULES },
        { label: 'Feature Flags', icon: <ToggleOnIcon />, path: AdminPath.FEATURE_FLAGS },
        { label: 'Service Zones', icon: <MapIcon />, path: AdminPath.ZONES },
        { label: 'Integrations', icon: <ExtensionIcon />, path: AdminPath.INTEGRATIONS },
      ],
    },
  ];
};
