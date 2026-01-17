import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../config/constants';

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        // Automatically logout on 401 UNAUTHORIZED
        const { logout } = await import('../slices/authSlice');
        api.dispatch(logout());
        console.warn('Session expired. Logging out...');
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Auth', 'Skills', 'UsersSkills', 'Swap', 'Feedback'],
    endpoints: () => ({}),
});
