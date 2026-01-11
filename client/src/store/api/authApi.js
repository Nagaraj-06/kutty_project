import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signin: builder.mutation({
            query: (credentials) => ({
                url: '/public/api/auth/signin',
                method: 'POST',
                body: credentials,
            }),
        }),
        signup: builder.mutation({
            query: (userData) => ({
                url: '/public/api/auth/signup',
                method: 'POST',
                body: userData,
            }),
        }),
        forgotPasswordRequest: builder.mutation({
            query: (data) => ({
                url: '/public/api/forget_password/request',
                method: 'POST',
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: '/public/api/forget_password/reset',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useSigninMutation, useSignupMutation, useForgotPasswordRequestMutation, useResetPasswordMutation } = authApi;

