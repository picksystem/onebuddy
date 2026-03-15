import { createAppMetadata } from '@bandi/theme';

export const useMetadata = () =>
  createAppMetadata(
    {
      title: 'Welcome to Favourites Page',
      description: 'This is the Favourites Page. You can manage your account here.',
    },
    {
      user: {
        title: 'Welcome to User Favourites Page',
        description: 'This is the User Favourites Page. You can manage your account here.',
      },
    },
  );
