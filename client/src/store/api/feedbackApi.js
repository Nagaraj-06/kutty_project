import { baseApi } from './baseApi';

export const feedbackApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFeedbacks: builder.query({
            query: (params) => ({
                url: '/private/api/feedback',
                method: 'GET',
                params: params, // Expects { userId: '...' }
            }),
            providesTags: ['Feedback'],
        }),
        giveFeedback: builder.mutation({
            query: (feedbackData) => ({
                url: '/private/api/feedback',
                method: 'POST',
                body: feedbackData,
            }),
            invalidatesTags: ['Feedback'],
        }),
    }),
});

export const { useGetFeedbacksQuery, useGiveFeedbackMutation } = feedbackApi;
