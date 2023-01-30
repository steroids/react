import {
    MODAL_CLOSE,
    MODAL_MARK_CLOSING,
    MODAL_OPEN,
} from '../../src/actions/modal';
import modal, {IModal} from '../../src/reducers/modal';

type TOpened = Record<string, IModal[]>;

describe('modal reducer', () => {
    const defaultInitialState = {opened: {} as TOpened};

    let initialState = {...defaultInitialState};

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    describe('MODAL_OPEN', () => {
        it('update modal in group', () => {
            const id = '1';
            const modalGroupName = 'group';
            const modalGroup = [
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
                    [modalGroupName]: modalGroup,
                },
            };

            const action = {
                type: MODAL_OPEN,
                group: modalGroupName,
                id,
                props: {
                    backgroundColor: '#000000',
                    borderSize: 'inherit',
                },
            };

            const expectedState = {...initialState};

            expectedState.opened[modalGroupName][0].props = {
                ...modalGroup[0].props,
                ...action.props,
            };

            expect(modal(initialState, action)).toEqual(expectedState);
        });

        it('add new modal to group', () => {
            const modalGroupName = 'group';
            const action = {
                type: MODAL_OPEN,
                id: '21',
                group: modalGroupName,
                modal: 'modal12',
                props: {
                    color: '#ffff',
                },
            };

            const modalGroup = [
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
                    [modalGroupName]: modalGroup,
                },
            };

            const expectedState = {
                opened: {
                    [modalGroupName]: [
                        ...initialState.opened[modalGroupName],
                        {
                            id: action.id,
                            modal: action.modal,
                            props: action.props,
                            isClosing: false,
                        },
                    ],
                },
            };

            expect(modal(initialState, action)).toEqual(expectedState);
        });
    });

    describe('MODAL_MARK_CLOSING', () => {
        it('with initialState return', () => {
            const modalGroupName = 'group';

            const modalGroup = [
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
                    [modalGroupName]: modalGroup,
                },
            };

            const action = {
                type: MODAL_MARK_CLOSING,
                id: 'modal15',
                group: modalGroupName,
            };

            const expectedState = {...initialState};

            expect(modal(initialState, action)).toEqual(expectedState);
        });

        it('with set isClosing true', () => {
            const id = 'modal3';
            const modalGroupName = 'group';
            const modalGroup = [
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
                    [modalGroupName]: modalGroup,
                },
            };

            const action = {
                type: MODAL_MARK_CLOSING,
                id,
                group: modalGroupName,
            };

            const expectedState = {...initialState};

            expectedState.opened[modalGroupName][0].isClosing = true;

            expect(modal(initialState, action)).toEqual(expectedState);
        });
    });

    describe('MODAL_CLOSE', () => {
        it('with initialState return ', () => {
            const modalGroupName = 'group';

            const modalGroup = [
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
                group: modalGroupName,
                id: 'modal15',
            };

            initialState = {
                opened: {
                    [modalGroupName]: modalGroup,
                },
            };

            const expectedState = {...initialState};

            expect(modal(initialState, action)).toEqual(expectedState);
        });

        it('with delete modal from group', () => {
            const id = 'modal15';
            const modalGroupName = 'group';

            const modalGroup = [
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
                group: modalGroupName,
            };

            initialState = {
                opened: {
                    [modalGroupName]: modalGroup,
                },
            };

            const expectedState = {...initialState};

            expectedState.opened[modalGroupName] = [];

            expect(modal(initialState, action)).toEqual(expectedState);
        });
    });
});
