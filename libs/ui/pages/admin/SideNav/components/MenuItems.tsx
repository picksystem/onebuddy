import DashboardIcon from '@mui/icons-material/Dashboard';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import CategoryIcon from '@mui/icons-material/Category';
import TollIcon from '@mui/icons-material/Toll';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CarRentalIcon from '@mui/icons-material/CarRental';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PercentIcon from '@mui/icons-material/Percent';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import RuleIcon from '@mui/icons-material/Rule';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import MapIcon from '@mui/icons-material/Map';
import ExtensionIcon from '@mui/icons-material/Extension';
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
      group: 'Team',
      items: [
        { label: 'Admins', icon: <AdminPanelSettingsIcon />, path: AdminPath.ADMINS },
        { label: 'Consultants', icon: <SupportAgentIcon />, path: AdminPath.CONSULTANT },
        { label: 'Access Management', icon: <VpnKeyIcon />, path: AdminPath.ACCESS_MANAGEMENT },
      ],
    },
    {
      group: 'Operations',
      items: [
        { label: 'Rides', icon: <LocalTaxiIcon />, path: AdminPath.RIDES },
        { label: 'Driver Hire', icon: <PersonSearchIcon />, path: AdminPath.DRIVER_HIRE },
        { label: 'Vehicle Rental', icon: <CarRentalIcon />, path: AdminPath.VEHICLE_RENTAL },
        { label: 'Parcel / Delivery', icon: <Inventory2Icon />, path: AdminPath.PARCEL },
        { label: 'Logistics', icon: <LocalShippingIcon />, path: AdminPath.LOGISTICS },
      ],
    },
    {
      group: 'People',
      items: [
        { label: 'Users', icon: <PeopleIcon />, path: AdminPath.USERS },
        { label: 'Captains', icon: <ManageAccountsIcon />, path: AdminPath.CAPTAINS },
        {
          label: 'Customer Management',
          icon: <VerifiedUserIcon />,
          path: AdminPath.USER_MANAGEMENT,
        },
        { label: 'Organizations', icon: <CorporateFareIcon />, path: AdminPath.ORGANIZATIONS },
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
