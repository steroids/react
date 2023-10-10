import _get from 'lodash-es/get';

import {
    KANBAN_INIT,
    KANBAN_MOVE_TASK,
    KANBAN_MOVE_COLUMN,
} from '../actions';

const initialState = {
    kanbans: {},
};

const reducerMap = {
    [KANBAN_INIT]: (state, action) => ({
        ...state,
        kanbans: {
            ...state.kanbans,
            [action.payload.kanbanId]: {
                ...action.payload,
            },
        },
    }),
    [KANBAN_MOVE_TASK]: (state, action) => {
        if (state.kanbans[action.kanbanId]) {
            const columns = _get(state, ['kanbans', action.kanbanId, 'columns']) || [];

            // move task to different column
            if (action.source.droppableId !== action.destination.droppableId) {
                const [sourceColumn] = columns.filter(({id}) => id === action.source.droppableId);
                const [destinationColumn] = columns.filter(({id}) => id === action.destination.droppableId);

                const sourceTask = sourceColumn.tasks;
                const destinationTask = destinationColumn.tasks;

                const [removed] = sourceTask.splice(action.source.index, 1);

                destinationTask.splice(action.destination.index, 0, removed);
            } else {
                const [{tasks}] = columns.filter(({id}) => id === action.source.droppableId);

                const [removed] = tasks.splice(action.source.index, 1);

                tasks.splice(action.destination.index, 0, removed);
            }

            return {
                ...state,
                kanbans: {
                    ...state.kanbans,
                    [action.kanbanId]: {
                        ...state.kanbans[action.kanbanId],
                        columns: [...columns],
                    },
                },
            };
        }
        return [];
    },
    [KANBAN_MOVE_COLUMN]: (state, action) => {
        if (state.kanbans[action.kanbanId]) {
            const columns = _get(state, ['kanbans', action.kanbanId, 'columns']) || [];

            const [removed] = columns.splice(action.source.index, 1);

            columns.splice(action.destination.index, 0, removed);

            return {
                ...state,
                kanbans: {
                    ...state.kanbans,
                    [action.kanbanId]: {
                        ...state.kanbans[action.kanbanId],
                        columns: [...columns],
                    },
                },
            };
        }
        return [];
    },
};

// TODO connect only when use
export default (state = initialState, action) => reducerMap[action.type]
    ? reducerMap[action.type](state, action)
    : state;

export const getKanban = (state, kanbanId) => _get(state, ['kanban', 'kanbans', kanbanId]) || null;
