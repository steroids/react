import _uniqueId from 'lodash-es/uniqueId';
import configureMockStore from 'redux-mock-store';

import {
    closeModal,
    modalMarkClosing,
    MODAL_CLOSE,
    MODAL_MARK_CLOSING,
    MODAL_OPEN,
    openModal,
} from '../../src/actions/modal';
import prepareMiddleware from '../mocks/storeMiddlewareMock';

const mockStore = configureMockStore([prepareMiddleware]);
const store = mockStore({});

const mockGroup = 'modalGroup3';

jest.mock('lodash-es/uniqueId');

describe('auth actions', () => {
    beforeEach(() => {
        store.clearActions();
    });

    describe('openModal', () => {
        const modal = () => null;

        it('with props', () => {
            const modalId = 'modal5';
            const modalGroup = 'primary';

            const props = {
                modalId,
                modalGroup,
            };

            const expectedActions = [
                {
                    type: MODAL_OPEN,
                    id: modalId,
                    modal,
                    group: modalGroup,
                    props,
                },
            ];

            store.dispatch(openModal(modal, props));
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('without props', () => {
            const modalId = 'modal32';

            const expectedActions = [
                {
                    type: MODAL_OPEN,
                    id: modalId,
                    modal,
                    group: null,
                    props: {},
                },
            ];

            _uniqueId.mockImplementation(() => modalId);
            store.dispatch(openModal(modal));
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('modalMarkClosing', () => {
        it('without group argument', () => {
            const modalId = 'modal1';

            const expectedActions = [
                {
                    type: MODAL_MARK_CLOSING,
                    id: modalId,
                    group: null,
                },
            ];

            store.dispatch(modalMarkClosing(modalId));
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('with group argument', () => {
            const modalId = 'modal2';

            const expectedActions = [
                {
                    type: MODAL_MARK_CLOSING,
                    id: modalId,
                    group: mockGroup,
                },
            ];

            store.dispatch(modalMarkClosing(modalId, mockGroup));
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('closeModal', () => {
        it('without group argument', () => {
            const modalId = 'modal3';

            const expectedActions = [
                {
                    type: MODAL_CLOSE,
                    id: modalId,
                    group: null,
                },
            ];

            store.dispatch(closeModal(modalId));
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('with group argument', () => {
            const modalId = 'modal4';
            const expectedActions = [
                {
                    type: MODAL_CLOSE,
                    id: modalId,
                    group: mockGroup,
                },
            ];

            store.dispatch(closeModal(modalId, mockGroup));
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
