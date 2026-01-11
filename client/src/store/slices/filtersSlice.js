import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    skillConnectSearch: '',
};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSkillConnectSearch: (state, action) => {
            state.skillConnectSearch = action.payload;
        },
        resetFilters: (state) => {
            state.skillConnectSearch = '';
        },
    },
});

export const { setSkillConnectSearch, resetFilters } = filtersSlice.actions;

export const selectSkillConnectSearch = (state) => state.filters.skillConnectSearch;

export default filtersSlice.reducer;
