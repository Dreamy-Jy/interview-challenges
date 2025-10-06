import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { DbRow } from './db/types';
import { DbClient } from './db/client';

type CaptionsState = {
    captions: DbRow[];
    isLoading: boolean;
};

type CaptionsAction =
    | { type: 'SET_CAPTIONS'; payload: DbRow[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'UPDATE_CAPTION_TEXT'; payload: { id: string; text: string } }
    | { type: 'UPDATE_CAPTION_TIMING'; payload: { id: string; timing: string } }

const initialState: CaptionsState = {
    captions: [],
    isLoading: false,
};

function captionsReducer(state: CaptionsState, action: CaptionsAction): CaptionsState {
    switch (action.type) {
        case 'SET_CAPTIONS':
            return {
                ...state,
                captions: action.payload,
                isLoading: false,
            };

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };

        case 'UPDATE_CAPTION_TEXT':
            return {
                ...state,
                captions: state.captions.map(caption =>
                    caption.id === action.payload.id
                        ? { ...caption, text: action.payload.text }
                        : caption
                ),
            };

        case 'UPDATE_CAPTION_TIMING':
            return {
                ...state,
                captions: state.captions.map(caption =>
                    caption.id === action.payload.id
                        ? { ...caption, timing: action.payload.timing }
                        : caption
                ),
            };

        default:
            return state;
    }
}

type CaptionsContextType = {
    state: CaptionsState;
    dispatch: React.Dispatch<CaptionsAction>;
    updateCaptionText: (id: string, text: string) => void;
    updateCaptionTiming: (id: string, timing: string) => void;
};

const CaptionsContext = createContext<CaptionsContextType | undefined>(undefined);

/**
 * moved db fetching logic here
 * use the context reducer pattern to manage state
 * 
 */
export function CaptionsProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(captionsReducer, initialState);

    // Query for caption data on mount
    useEffect(() => {
        const fetchCaptions = async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                const dbClient = new DbClient();
                const results = await dbClient.getAllRows();
                const captions = results.map(result => result.result);
                dispatch({ type: 'SET_CAPTIONS', payload: captions });
                console.log('Fetched captions:', captions);
            } catch (error) {
                console.error('Failed to fetch captions:', error);
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        fetchCaptions();
    }, []);

    const updateCaptionText = (id: string, text: string) => {
        dispatch({ type: 'UPDATE_CAPTION_TEXT', payload: { id, text } });
    };

    const updateCaptionTiming = (id: string, timing: string) => {
        dispatch({ type: 'UPDATE_CAPTION_TIMING', payload: { id, timing } });
    };

    return (
        <CaptionsContext value={{
            state,
            dispatch,
            updateCaptionText,
            updateCaptionTiming,
        }}>
            {children}
        </CaptionsContext>
    );
}

export function useCaptions() {
    const context = useContext(CaptionsContext);
    if (context === undefined) {
        throw new Error('useCaptions must be used within a CaptionsProvider');
    }
    return context;
}