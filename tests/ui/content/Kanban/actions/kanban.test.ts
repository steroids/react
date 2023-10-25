import configureMockStore from 'redux-mock-store';
import {
    KANBAN_MOVE_COLUMN,
    KANBAN_INIT,
    KANBAN_MOVE_TASK,
    KANBAN_ADD_TASK,
    KANBAN_EDIT_TASK,
    KANBAN_INCREASE_TASK_ID,
    kanbanInit,
    kanbanMoveColumn,
    kanbanMoveTask,
    kanbanAddTask,
    kanbanEditTask,
    kanbanIncreaseTaskId,
} from '../../../../../src/ui/content/Kanban/actions';
import prepareMiddleware from '../../../../mocks/storeMiddlewareMock';

const mockStore = configureMockStore([prepareMiddleware]);
const store = mockStore({});

describe('kanban actions', () => {
    beforeEach(() => {
        store.clearActions();
    });

    const task = {
        id: 1,
        title: 'Task',
        description: '',
        fullDescription: '',
        priority: null,
        assigner: null,
        tags: null,
    };

    const source = {
        index: 0,
        droppableId: 2,
    };

    const destination = {
        droppableId: 2,
        index: 1,
    };

    it('kanbanInit', () => {
        const kanbanId = 'kanban1';

        const payload = {
            kanbanId,
            columns: [],
            tags: [],
            lastTaskId: 335,
        };

        const expectedActions = [
            {
                type: KANBAN_INIT,
                payload,
            },
        ];

        store.dispatch(kanbanInit(kanbanId, payload));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('kanbanMoveTask', () => {
        const kanbanId = 'kanban2';

        const expectedActions = [
            {
                type: KANBAN_MOVE_TASK,
                kanbanId,
                source,
                destination,
            },
        ];

        store.dispatch(kanbanMoveTask(kanbanId, source, destination));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('kanbanMoveColumn', () => {
        const kanbanId = 'kanban3';

        const expectedActions = [
            {
                type: KANBAN_MOVE_COLUMN,
                kanbanId,
                source,
                destination,
            },
        ];

        store.dispatch(kanbanMoveColumn(kanbanId, source, destination));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('kanbanAddTask', () => {
        const kanbanId = 'kanban4';
        const columnId = 1;

        const expectedActions = [
            {
                type: KANBAN_ADD_TASK,
                kanbanId,
                columnId,
                task,
            },
        ];

        store.dispatch(kanbanAddTask(kanbanId, columnId, task));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('kanbanEditTask', () => {
        const kanbanId = 'kanban5';
        const columnId = 1;
        const prevColumnId = 2;

        const expectedActions = [
            {
                type: KANBAN_EDIT_TASK,
                kanbanId,
                columnId,
                prevColumnId,
                task,
            },
        ];

        store.dispatch(kanbanEditTask(kanbanId, columnId, prevColumnId, task));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('kanbanIncreaseTaskId', () => {
        const kanbanId = 'kanban6';
        const lastTaskId = 1;

        const expectedActions = [
            {
                type: KANBAN_INCREASE_TASK_ID,
                kanbanId,
                lastTaskId,
            },
        ];

        store.dispatch(kanbanIncreaseTaskId(kanbanId, lastTaskId));
        expect(store.getActions()).toEqual(expectedActions);
    });
});
