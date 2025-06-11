import _get from 'lodash-es/get';
import {
    KANBAN_INIT,
    KANBAN_MOVE_TASK,
    KANBAN_MOVE_COLUMN,
    KANBAN_ADD_TASK,
    KANBAN_EDIT_TASK,
    KANBAN_INCREASE_TASK_ID,
} from '../actions';

const initialState = {
    kanbans: {},
};

export const getKanbanColumns = (state, kanbanId) => _get(state, ['kanbans', kanbanId, 'columns']) || [];

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

            const sourceColumn = columns.find((column) => column.id === Number(action.source.droppableId));
            const sourceTasks = sourceColumn.tasks;
            const [removedTask] = sourceTasks.splice(action.source.index, 1);

            // move task to different column
            if (action.source.droppableId !== action.destination.droppableId) {
                const destinationColumn = columns.find((column) => column.id === Number(action.destination.droppableId));
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
    [KANBAN_ADD_TASK]: (state, action) => {
        if (state.kanbans[action.kanbanId]) {
            const columns = getKanbanColumns(state, action.kanbanId);

            const sourceColumn = columns.find(column => column.id === action.columnId);
            const sourceTasks = sourceColumn.tasks;

            sourceTasks.unshift(action.task);

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
    [KANBAN_EDIT_TASK]: (state, action) => {
        if (state.kanbans[action.kanbanId]) {
            const columns = getKanbanColumns(state, action.kanbanId);

            const sourceColumn = columns.find(column => column.tasks.find(task => task.id === action.task.id));
            const sourceTasks = sourceColumn.tasks;

            // move to different column
            if (action.columnId !== action.prevColumnId) {
                const destinationColumn = columns.find(column => column.id === action.columnId);

                const destinationTasks = destinationColumn.tasks;

                const taskIndex = sourceTasks.findIndex(task => task.id === action.task.id);
                const [removedTask] = sourceTasks.splice(taskIndex, 1);

                destinationTasks.unshift(removedTask);

                Object.assign(removedTask, action.task);
            } else {
                const sourceTask = sourceTasks.find(task => task.id === action.task.id);

                Object.assign(sourceTask, action.task);
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
    [KANBAN_INCREASE_TASK_ID]: (state, action) => ({
        ...state,
        kanbans: {
            ...state.kanbans,
            [action.kanbanId]: {
                ...state.kanbans[action.kanbanId],
                lastTaskId: action.lastTaskId,
            },
        },
    }),
};

// eslint-disable-next-line default-param-last
export default (state = initialState, action) => reducerMap[action.type]
    ? reducerMap[action.type](state, action)
    : state;

export const getKanban = (state, kanbanId) => _get(state, ['kanban', 'kanbans', kanbanId]) || null;

export const getLastTaskId = (state, kanbanId) => _get(state, ['kanban', 'kanbans', kanbanId, 'lastTaskId']) || null;

export const getKanbanTags = (state, kanbanId) => _get(state, ['kanban', 'kanbans', kanbanId, 'tags']) || null;
