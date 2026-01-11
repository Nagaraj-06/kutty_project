import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserProfile: builder.query({
            query: () => ({
                url: '/private/api/users/user_profile_details',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateUserProfile: builder.mutation({
            query: (profileData) => ({
                url: '/private/api/users/update_profile',
                method: 'PATCH',
                body: profileData,
            }),
            invalidatesTags: ['User'],
        }),
        getUserPublicProfile: builder.query({
            query: (userId) => ({
                url: `/private/api/users/profile/${userId}`,
                method: 'GET',
            }),
            providesTags: (result, error, arg) => [{ type: 'User', id: arg }],
        }),
    }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation, useGetUserPublicProfileQuery } = userApi;
