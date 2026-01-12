
import { baseApi } from './baseApi';

export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getChatList: builder.query({
            query: () => '/private/api/chat/chat_list',
            providesTags: ['ChatList'],
        }),
        getChatMessages: builder.query({
            query: (chatSessionId) => `/private/api/chat/get_chat?chat_session_id=${chatSessionId}`,
            providesTags: (result, error, id) => [{ type: 'ChatMessages', id }],
        }),
        // Assuming a send message endpoint existed or user would want one, 
        // but sticking to requested GETs for now unless implicit. 
        // I will add a placeholder for sendMessage if I find the route in backend, 
        // otherwise just the GETs as requested.
    }),
});

export const { useGetChatListQuery, useGetChatMessagesQuery } = chatApi;
