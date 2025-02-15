import React, { createContext, useReducer } from 'react';

export const AppReducer = (state, action) => {
    switch (action.type) {
        case 'LIST_RESPONSE_SUCCESS':
            return {...state, listResponse: action.payload.listResponse, prevPage: action.payload.prevPage,
                nextPage: action.payload.nextPage, numPages: action.payload.numPages,
            };
        case 'LIST_RESPONSE_ERROR':
            return {...state, listResponse: { error: action.payload.error }, prevPage: null, nextPage: null, numPages: 0 };
        case 'SET_URL':
            const result = action.payload.url.split("?page=");
            let url = action.payload.url;
            let page = 1;
            if (result.length === 2) {
                url = result[0];
                page = parseInt(result[1]);
            }
            return {...state, url: url, page: page};
        case 'SET_QUERY_ARGS':
            let status = action.payload.statusFilter;
            if (status === 'All') {
                status = null;
            }
            return {...state, page: action.payload.page, statusFilter: status};
        case 'SET_PAGE':
            return {...state, page: action.payload.page};
        default:
            return state;
    }
};

export const AppContext = createContext();

const initialState = {
    defaultUrl: process.env.REACT_APP_RNM_CHARLIST_URL,
    url: process.env.REACT_APP_RNM_CHARLIST_URL,
    prevPage: null,
    nextPage: null,
    numPages: 0,
    listResponse: null,
    detailsResponse: null,
    page: 1,
    statusFilter: null,
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