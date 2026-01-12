import { baseApi } from './baseApi';

export const swapsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSwap: builder.mutation({
            query: (swapData) => ({
                url: '/private/api/swaps',
                method: 'POST',
                body: swapData,
            }),
            invalidatesTags: ['Swap'],
        }),
        getUserSwaps: builder.query({
            query: () => '/private/api/swaps/get_user_swaps',
            providesTags: ['Swap'],
        }),
        updateSwapStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/private/api/swaps/update_status?id=${id}`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Swap'],
        }),
        markSwapComplete: builder.mutation({
            query: (skill_swap_id) => ({
                url: `/private/api/swaps/mark_complete?skill_swap_id=${skill_swap_id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Swap'],
        }),
    }),
});

export const {
    useCreateSwapMutation,
    useGetUserSwapsQuery,
    useUpdateSwapStatusMutation,
    useMarkSwapCompleteMutation
} = swapsApi;
