import {
    getKanban,
    getKanbanTags,
    getKanbanColumns,
    getLastTaskId,
} from '../../../../../src/ui/content/Kanban/reducers/kanban';

type TKanbanFields = Record<string, any> | null;

describe('kanban getters', () => {
    const defaultInitialState = {
        kanbans: {},
    };

    let initialState = {...defaultInitialState};

    const getStateWithWrappedKanbans = (
        kanbans: TKanbanFields = null,
        extraData: TKanbanFields = null,
    ) => ({
        kanban: {
            ...initialState,
            kanbans: {...kanbans},
            ...extraData,
        },
    });

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    describe('getKanban', () => {
        it('should return kanban', () => {
            const kanbanId = 'kanbanId';

            const listProperties = {
                kanbanId: 'kanbanId',
            };

            const kanbans = {[kanbanId]: listProperties};
            const state = getStateWithWrappedKanbans(kanbans);
            expect(getKanban(state, kanbanId)).toEqual(listProperties);
        });

        it('should return null', () => {
            const existingKanbanId = 'existingKanbanId';
            const notExistingKanbanId = 'notExistingKanbanId';
            const expectedEmptyKanban = null;

            const kanbans = {
                [existingKanbanId]: {
                    kanbanId: 'kanbanId',
                },
            };

            const state = getStateWithWrappedKanbans(kanbans);
            expect(getKanban(state, notExistingKanbanId)).toEqual(expectedEmptyKanban);
        });
    });

    describe('getKanbanTags', () => {
        const kanbanId = 'kanbanId';

        const kanbans = {
            [kanbanId]: {
                kanbanId,
                tags: [1, 2, 3],
            },
        };

        it('should return null', () => {
            const anotherKanbanId = 'anotherKanbanId';
            const state = getStateWithWrappedKanbans(kanbans);
            const expectedResult = null;

            expect(getKanbanTags(state, anotherKanbanId)).toEqual(expectedResult);
        });

        it('should return tags', () => {
            const expectedTags = kanbans[kanbanId].tags;
            const state = getStateWithWrappedKanbans(kanbans);

            expect(getKanbanTags(state, kanbanId)).toEqual(expectedTags);
        });
    });

    describe('getLastTaskId', () => {
        const kanbanId = 'kanbanId';

        const kanbans = {
            [kanbanId]: {
                kanbanId,
                lastTaskId: 1,
            },
        };

        it('should return null', () => {
            const notExistingKanbanId = 'notExistingKanbanId';
            const expectedResult = null;

            const state = getStateWithWrappedKanbans(kanbans);

            expect(getLastTaskId(state, notExistingKanbanId)).toEqual(expectedResult);
        });

        it('should return lastTaskId', () => {
            const expectedId = kanbans[kanbanId].lastTaskId;

            const state = getStateWithWrappedKanbans(kanbans);

            expect(getLastTaskId(state, kanbanId)).toEqual(expectedId);
        });
    });

    describe('getKanbanColumns', () => {
        const kanbanId = 'kanbanId';

        const kanbans = {
            [kanbanId]: {
                kanbanId,
                columns: [{
                    id: 1,
                    title: 'column',
                    tasks: [],
                }],
            },
        };

        it('should return empty array', () => {
            const notExistingKanbanId = 'notExistingKanbanId';
            const expectedResult = [];

            const state = {
                [kanbanId]: {
                    kanbanId,
                    columns: [{
                        id: 1,
                        title: 'column',
                        tasks: [],
                    }],
                },
            };

            expect(getKanbanColumns(state, notExistingKanbanId)).toEqual(expectedResult);
        });

        it('should return columns', () => {
            const expectedColumns = kanbans[kanbanId].columns;

            const {kanban} = getStateWithWrappedKanbans(kanbans);

            expect(getKanbanColumns(kanban, kanbanId)).toEqual(expectedColumns);
        });
    });
});
