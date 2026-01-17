import { baseApi } from './baseApi';

export const skillsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSkills: builder.query({
            query: () => ({
                url: '/public/api/skills',
                method: 'GET',
            }),
            providesTags: ['Skills'],
        }),
        getUsersSkills: builder.query({
            query: () => ({
                url: '/public/api/skills/users_skills',
                method: 'GET',
            }),
            providesTags: ['UsersSkills'],
        }),
    }),
});

export const { useGetSkillsQuery, useGetUsersSkillsQuery } = skillsApi;
