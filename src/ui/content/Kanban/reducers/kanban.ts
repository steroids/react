import _get from 'lodash-es/get';
import {
    KANBAN_INIT,
    KANBAN_MOVE_TASK,
    KANBAN_MOVE_COLUMN,
} from '../actions';

const initialState = {
    kanbans: {},
};

const getKanbanColumns = (state, kanbanId) => _get(state, ['kanbans', kanbanId, 'columns']) || [];

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
            const columns = getKanbanColumns(state, action.kanbanId);

            const sourceColumn = columns.find((column) => column.id === action.source.droppableId);
            const sourceTasks = sourceColumn.tasks;
            const [removedTask] = sourceTasks.splice(action.source.index, 1);

            // move task to different column
            if (action.source.droppableId !== action.destination.droppableId) {
                const destinationColumn = columns.find((column) => column.id === action.destination.droppableId);
                const destinationTasks = destinationColumn.tasks;

                destinationTasks.splice(action.destination.index, 0, removedTask);
            } else {
                sourceTasks.splice(action.destination.index, 0, removedTask);
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
            const columns = getKanbanColumns(state, action.kanbanId);

            const [removedColumn] = columns.splice(action.source.index, 1);

            columns.splice(action.destination.index, 0, removedColumn);

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

export default (state = initialState, action) => reducerMap[action.type]
    ? reducerMap[action.type](state, action)
    : state;

export const getKanban = (state, kanbanId) => _get(state, ['kanban', 'kanbans', kanbanId]) || null;
