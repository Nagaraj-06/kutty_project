
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
        uploadChatFile: builder.mutation({
            query: (formData) => ({
                url: '/private/api/chat/upload-file',
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});

export const {
    useGetChatListQuery,
    useGetChatMessagesQuery,
    useUploadChatFileMutation
} = chatApi;
