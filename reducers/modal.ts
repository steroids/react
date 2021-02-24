import _get from 'lodash-es/get';
import {MODAL_OPEN, MODAL_CLOSE, MODAL_MARK_CLOSING} from '../actions/modal';

export const MODAL_DEFAULT_GROUP = 'modal';

const initialState = {
    opened: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case MODAL_OPEN:
            return (() => {
                const group = action.group || MODAL_DEFAULT_GROUP;
                const items = _get(state, ['opened', group]) || [];
                const index = items.findIndex(item => item.id === action.id);
                if (index !== -1) {
                    items[index].props = {
                        ...items[index].props,
                        ...action.props,
                    };
                } else {
                    items.push({
                        id: action.id,
                        modal: action.modal,
                        props: action.props,
                        isClosing: false,
                    });
                }

                return {
                    opened: {
                        ...state.opened,
                        [group]: [].concat(items),
                    },
                };
            })();

        case MODAL_MARK_CLOSING:
            return (() => {
                const group = action.group || MODAL_DEFAULT_GROUP;
                const items = _get(state, ['opened', group]) || [];
                const index = items.findIndex(item => item.id === action.id);
                if (index !== -1) {
                    items[index] = {
                        ...items[index],
                        isClosing: true,
                    };
                }
                return {
                    opened: {
                        ...state.opened,
                        [group]: [].concat(items),
                    },
                };
            })();

        case MODAL_CLOSE:
            return (() => {
                const group = action.group || MODAL_DEFAULT_GROUP;
                const items = _get(state, ['opened', group]) || [];
                const index = items.findIndex(item => item.id === action.id);
                if (index !== -1) {
                    items.splice(index, 1);
                }
                return {
                    opened: {
                        ...state.opened,
                        [group]: [].concat(items),
                    },
                };
            })();

        default:
            return state;
    }
};

export const getOpened = (state, group = MODAL_DEFAULT_GROUP) => _get(state, ['modal', 'opened', group]) || null;
