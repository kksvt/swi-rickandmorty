import React, { createContext, useReducer } from 'react';

export const AppReducer = (state, action) => {
    switch (action.type) {
        case 'LIST_RESPONSE_SUCCESS':
            return {...state, listResponse: action.payload.listResponse, prevPage: action.payload.prevPage,
                nextPage: action.payload.nextPage, numPages: action.payload.numPages,
            };
        case 'LIST_RESPONSE_ERROR':
            return {...state, listResponse: { error: action.payload.error }, prevPage: null, nextPage: null, numPages: 0 };
        case 'SET_URL': {
            let url = action.payload.url;
            let page = state.page;
            let filter = state.statusFilter;
            const results = url.split('?');
            if (results.length > 1) {
                const params = new URLSearchParams(new URL(url).search);
                url = results[0];
                page = params.get('page') || page; //overwrite the params only if they exist within the query
                filter = params.get('filter') || filter;
            }
            return {...state, url: url, page: page, statusFilter: filter};
        }
        case 'SET_QUERY_ARGS': {
            let status = action.payload.statusFilter;
            if (status === 'All') {
                status = null;
            }
            return {...state, page: action.payload.page, statusFilter: status};
        }
        case 'SET_PAGE':
            return {...state, page: action.payload.page};
        case 'SET_EPISODE_DATA': {
            let episodeData = {...state.episodeData};
                if (action.payload.episodeData && action.payload.episodeData.length) {
                action.payload.episodeData.forEach(epData => {
                    episodeData[epData.id] = {name: epData.name, episode: epData.episode};
                });
            }
            return {...state, episodeData: episodeData };
        }
        default:
            return state;
    }
};

export const AppContext = createContext();

const initialState = {
    defaultUrl: process.env.REACT_APP_RNM_CHARLIST_URL,
    defaultCharacterUrl: process.env.REACT_APP_RNM_CHAR_URL,
    defaultEpisodeUrl: process.env.REACT_APP_RNM_EPISODES_URL,
    url: process.env.REACT_APP_RNM_CHARLIST_URL,
    prevPage: null,
    nextPage: null,
    numPages: 0,
    listResponse: null,
    detailsResponse: null,
    page: 1,
    statusFilter: null,
    episodeData: {},
}

export const AppProvider = (props) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    return (
        <AppContext.Provider
            value = {{
                state,   
                dispatch,
            }}
            >
            {props.children}
            </AppContext.Provider>
    );
};