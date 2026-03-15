import { createContext, useContext } from 'react';

export type AppRole = 'admin' | 'user' | 'captain';

/**
 * React context that identifies whether the current render tree
 * is admin pages, user pages, or captain pages. Used by createAppStyles and
 * createAppMetadata to pick the correct override key.
 */
export const AppRoleContext = createContext<AppRole>('admin');

/**
 * Hook to read the current app role ('admin' | 'user' | 'captain')
 */
export const useAppRole = (): AppRole => useContext(AppRoleContext);
