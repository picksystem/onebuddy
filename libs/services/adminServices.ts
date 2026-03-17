import { baseApi } from './baseServices';

export const adminApi = baseApi.injectEndpoints({
  endpoints: () => ({}),
  overrideExisting: false,
});
