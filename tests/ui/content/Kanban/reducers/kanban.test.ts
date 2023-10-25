import {
    KANBAN_MOVE_COLUMN,
    KANBAN_INIT,
    KANBAN_MOVE_TASK,
    KANBAN_ADD_TASK,
    KANBAN_EDIT_TASK,
    KANBAN_INCREASE_TASK_ID,
} from '../../../../../src/ui/content/Kanban/actions';
import kanban from '../../../../../src/ui/content/Kanban/reducers';

type TKanbanFields = Record<string, any> | null;

describe('list reducers', () => {
    const defaultInitialState = {
        kanbans: {},
    };

    let initialState = {...defaultInitialState};

    const getStateWithKanbans = (
        kanbans: TKanbanFields = null,
    ) => ({
        kanbans: {
            ...kanbans,
        },
    });

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    const kanbanId = 'kanbanId';

    const task = {
        id: 1,
        title: 'Task',
        description: '',
        fullDescription: '',
        priority: null,
        assigner: null,
        tags: null,
    };

    it('KANBAN_INIT', () => {
        const columns = [
            {
                id: 1,
                title: 'column1',
                tasks: [],
            },
            {
                id: 1,
                title: 'column2',
                tasks: [],
            },
        ];

        const action = {
            type: KANBAN_INIT,
            payload: {
                kanbanId,
                columns,
                tags: null,
                lastTaskId: null,
            },
        };

        const kanbans = {
            anotherKanbanId: {
                kanbanId: 'anotherKanbanId',
                columns: [],
            },
        };

        const state = getStateWithKanbans(kanbans);

        const expectedState = {
            ...initialState,
            kanbans: {
                ...state.kanbans,
                [kanbanId]: {
                    ...action.payload,
                },
            },
        };

        expect(kanban(state, action)).toEqual(expectedState);
    });

    it('KANBAN_MOVE_TASK', () => {
        const anotherTask = {
            id: 'anotherTask',
        };

        const source = {
            index: 0,
            droppableId: '1',
        };

        const destination = {
            droppableId: '1',
            index: 1,
        };

        const column = {
            id: 1,
            tasks: [task, anotherTask],
        };

        const action = {
            type: KANBAN_MOVE_TASK,
            kanbanId,
            source,
            destination,
        };

        const kanbans = {
            [kanbanId]: {
                kanbanId,
                columns: [column],
            },
        };

        const state = getStateWithKanbans(kanbans);

        const expectedColumn = {
            ...column,
            tasks: column.tasks.reverse(),
        };

        const expectedState = {
            ...initialState,
            kanbans: {
                ...state.kanbans,
                [kanbanId]: {
                    ...state.kanbans[kanbanId],
                    columns: [expectedColumn],
                },
            },
        };

        expect(kanban(state, action)).toEqual(expectedState);
    });

    it('KANBAN_MOVE_TASK move to different column', () => {
        const source = {
            index: 0,
            droppableId: '1',
        };

        const destination = {
            droppableId: '2',
            index: 0,
        };

        const sourceColumn = {
            id: 1,
            tasks: [task],
        };

        const destinationColumn = {
            id: 2,
            tasks: [],
        };

        const action = {
            type: KANBAN_MOVE_TASK,
            kanbanId,
            source,
            destination,
        };

        const kanbans = {
            [kanbanId]: {
                kanbanId,
                columns: [sourceColumn, destinationColumn],
            },
        };

        const state = getStateWithKanbans(kanbans);

        const expectedSourceColumn = {
            ...sourceColumn,
            tasks: [],
        };

        const expectedDestinationColumn = {
            ...destinationColumn,
            tasks: [task],
        };

        const expectedState = {
            ...initialState,
            kanbans: {
                ...state.kanbans,
                [kanbanId]: {
                    ...state.kanbans[kanbanId],
                    columns: [expectedSourceColumn, expectedDestinationColumn],
                },
            },
        };

        expect(kanban(state, action)).toEqual(expectedState);
    });

    it('KANBAN_MOVE_COLUMN', () => {
        const source = {
            index: 1,
            droppableId: 'all-columns',
        };

        const destination = {
            index: 0,
            droppableId: 'all-columns',
        };

        const movedColumn = {
            id: 1,
            title: 'movedColumn',
            tasks: [],
        };

        const anotherColumn = {
            id: 2,
            title: 'anotherColumn',
            tasks: [],
        };

        const action = {
            type: KANBAN_MOVE_COLUMN,
            kanbanId,
            source,
            destination,
        };

        const columns = [anotherColumn, movedColumn];

        const kanbans = {
            [kanbanId]: {
                kanbanId,
                columns,
            },
        };

        const state = getStateWithKanbans(kanbans);

        const expectedState = {
            ...initialState,
            kanbans: {
                ...state.kanbans,
                [kanbanId]: {
                    ...state.kanbans[kanbanId],
                    columns: columns.reverse(),
                },
            },
        };

        expect(kanban(state, action)).toEqual(expectedState);
    });

    it('KANBAN_ADD_TASK', () => {
        const targetColumn = {
            id: 1,
            tasks: [],
        };
        const anotherColumn = {
            id: 2,
            tasks: [],
        };

        const action = {
            type: KANBAN_ADD_TASK,
            kanbanId,
            columnId: targetColumn.id,
            task,
        };

        const kanbans = {
            [kanbanId]: {
                kanbanId,
                columns: [targetColumn, anotherColumn],
            },
        };

        const state = getStateWithKanbans(kanbans);

        const expectedTargetColumn = {
            ...targetColumn,
            tasks: [].concat(task),
        };

        const expectedState = {
            ...initialState,
            kanbans: {
                ...state.kanbans,
                [kanbanId]: {
                    ...state.kanbans[kanbanId],
                    columns: [expectedTargetColumn, anotherColumn],
                },
            },
        };

        expect(kanban(state, action)).toEqual(expectedState);
    });

    it('KANBAN_EDIT_TASK move to different column', () => {
        const sourceColumn = {
            id: 1,
            tasks: [task],
        };
        const destinationColumn = {
            id: 2,
            tasks: [],
        };

        const editedTask = {
            ...task,
            title: 'New title',
        };

        const action = {
            type: KANBAN_EDIT_TASK,
            kanbanId,
            columnId: destinationColumn.id,
            prevColumnId: sourceColumn.id,
            task: editedTask,
        };

        const kanbans = {
            [kanbanId]: {
                kanbanId,
                columns: [sourceColumn, destinationColumn],
            },
        };

        const state = getStateWithKanbans(kanbans);

        const expectedSourceColumn = {
            ...sourceColumn,
            tasks: [],
        };

        const expectedDestinationColumn = {
            ...destinationColumn,
            tasks: [editedTask],
        };

        const expectedState = {
            ...initialState,
            kanbans: {
                ...state.kanbans,
                [kanbanId]: {
                    ...state.kanbans[kanbanId],
                    columns: [expectedSourceColumn, expectedDestinationColumn],
                },
            },
        };

        expect(kanban(state, action)).toEqual(expectedState);
    });

    it('KANBAN_EDIT_TASK', () => {
        const sourceColumn = {
            id: 1,
            tasks: [task],
        };
        const anotherColumn = {
            id: 2,
            tasks: [],
        };

        const editedTask = {
            ...task,
            title: 'New title',
        };

        const action = {
            type: KANBAN_EDIT_TASK,
            kanbanId,
            columnId: sourceColumn.id,
            prevColumnId: sourceColumn.id,
            task: editedTask,
        };

        const kanbans = {
            [kanbanId]: {
                kanbanId,
                columns: [sourceColumn, anotherColumn],
            },
        };

        const state = getStateWithKanbans(kanbans);

        const expectedSourceColumn = {
            ...sourceColumn,
            tasks: [editedTask],
        };

        const expectedState = {
            ...initialState,
            kanbans: {
                ...state.kanbans,
                [kanbanId]: {
                    ...state.kanbans[kanbanId],
                    columns: [expectedSourceColumn, anotherColumn],
                },
            },
        };

        expect(kanban(state, action)).toEqual(expectedState);
    });

    it('KANBAN_INCREASE_TASK_ID', () => {
        const lastTaskId = 1;

        const action = {
            type: KANBAN_INCREASE_TASK_ID,
            kanbanId,
            lastTaskId,
        };

        const kanbans = {
            [kanbanId]: {
                kanbanId,
                columns: [],
                lastTaskId: 0,
            },
        };

        const state = getStateWithKanbans(kanbans);

        const expectedState = {
            ...initialState,
            kanbans: {
                ...state.kanbans,
                [kanbanId]: {
                    ...state.kanbans[kanbanId],
                    lastTaskId,
                },
            },
        };

        expect(kanban(state, action)).toEqual(expectedState);
    });
});
