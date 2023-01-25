import {
    MODAL_CLOSE,
    MODAL_MARK_CLOSING,
    MODAL_OPEN,
} from '../../src/actions/modal';
import modal, {IModal} from '../../src/reducers/modal';

type TOpened = Record<string, IModal[]>;

describe('modal reducer', () => {
    let initialState = {opened: {} as TOpened};

    beforeEach(() => {
        initialState = {opened: {}};
    });

    describe('MODAL_OPEN', () => {
        it('modal merge props with group', () => {
            const id = '1';
            const modalGroup = 'group';
            const group = [
                {
                    id,
                    modal: null,
                    props: {
                        megaLine: true,
                        megaBeautifulModal: true,
                    },
                    isClosing: false,
                },
            ];

            initialState = {
                opened: {
                    group,
                },
            };

            const action = {
                type: MODAL_OPEN,
                group: modalGroup,
                id,
                props: {
                    backgroundColor: '#000000',
                    borderSize: 'inherit',
                },
            };

            const expectedState = {...initialState};

            expectedState.opened[modalGroup][0].props = {
                ...group[0].props,
                ...action.props,
            };

            expect(modal(initialState, action)).toEqual(expectedState);
        });
        it('new modal to group', () => {
            const modalGroup = 'group';
            const action = {
                type: MODAL_OPEN,
                id: '21',
                group: modalGroup,
                modal: 'modal12',
            };

            const group = [
                {
                    id: '1',
                    modal: null,
                    props: {
                        megaLine: true,
                        megaBeautifulModal: true,
                    },
                    isClosing: false,
                },
            ];

            initialState = {
                opened: {
                    group, // items in reducer
                },
            };

            const expectedState = {...initialState};

            expectedState.opened[modalGroup] = [
                ...initialState.opened[modalGroup],
                {
                    id: action.id,
                    modal: action.modal,
                    isClosing: false,
                    props: {
                        ultraScrollable: true,
                    },
                },
            ];

            expect(modal(initialState, action)).toEqual(expectedState);
        });
    });

    describe('MODAL_MARK_CLOSING', () => {
        it('with initialState return', () => {
            const modalGroup = 'group';

            const group = [
                {
                    id: 'modal3',
                    modal: null,
                    props: {
                        megaLine: true,
                        megaBeautifulModal: true,
                    },
                    isClosing: false,
                },
            ];

            initialState = {
                opened: {
                    group,
                },
            };

            const action = {
                type: MODAL_MARK_CLOSING,
                id: 'modal15',
                group: modalGroup,
            };

            const expectedState = initialState;

            expect(modal(initialState, action)).toEqual(expectedState);
        });
        it('with set isClosing true', () => {
            const id = 'modal3';
            const modalGroup = 'group';
            const group = [
                {
                    id,
                    modal: null,
                    props: {
                        megaLine: true,
                        megaBeautifulModal: true,
                    },
                    isClosing: false,
                },
            ];

            initialState = {
                opened: {
                    group,
                },
            };

            const action = {
                type: MODAL_MARK_CLOSING,
                id,
                group: modalGroup,
            };

            const expectedState = {...initialState};

            expectedState.opened[modalGroup][0].isClosing = true;

            expect(modal(initialState, action)).toEqual(expectedState);
        });
    });
    describe('MODAL_CLOSE', () => {
        it('with initialState return ', () => {
            const modalGroup = 'group';

            const group = [
                {
                    id: 'modal30',
                    modal: null,
                    props: {
                        megaLine: true,
                        megaBeautifulModal: true,
                    },
                    isClosing: false,
                },
            ];

            const action = {
                type: MODAL_CLOSE,
                group: modalGroup,
                id: 'modal15',
            };

            initialState = {
                opened: {group},
            };

            const expectedState = initialState;

            expect(modal(initialState, action)).toEqual(expectedState);
        });
        it('with delete modal from group', () => {
            const id = 'modal15';
            const modalGroup = 'group';

            const group = [
                {
                    id,
                    modal: null,
                    props: {
                        megaLine: true,
                        megaBeautifulModal: true,
                    },
                    isClosing: false,
                },
            ];

            const action = {
                type: MODAL_CLOSE,
                id,
                group: modalGroup,
            };

            initialState = {
                opened: {
                    group,
                },
            };

            const expectedState = {...initialState};

            expectedState.opened[modalGroup] = [];

            expect(modal(initialState, action)).toEqual(expectedState);
        });
    });
});
