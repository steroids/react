import {set as _set, delete as _delete} from 'dot-prop-immutable';
import _get from 'lodash-es/get';

import {MODAL_OPEN, MODAL_CLOSE, MODAL_MARK_CLOSING} from '../actions/modal';

export const MODAL_DEFAULT_GROUP = 'modal';

export interface IModal {
    id: string | number,
    modal: any,
    props: any,
    isClosing: boolean,
}

const initialState = {
    opened: {} as Record<string, IModal[]>,
};

// eslint-disable-next-line default-param-last
export default (state = initialState, action) => {
    switch (action.type) {
        case MODAL_OPEN:
            return (() => {
                const group = action.group || MODAL_DEFAULT_GROUP;
                const items = _get(state, ['opened', group]) || [];
                const index = items.findIndex(item => item.id === action.id);
                if (index !== -1) {
                    return _set(state, `opened.${group}.${index}.props`, {
                        ...items[index].props,
                        ...action.props,
                    });
                }

                return _set(state, `opened.${group}`, [
                    ...items,
                    {
                        id: action.id,
                        modal: action.modal,
                        props: action.props,
                        isClosing: false,
                    },
                ]);
            })();

        case MODAL_MARK_CLOSING:
            return (() => {
                const group = action.group || MODAL_DEFAULT_GROUP;
                const items = _get(state, ['opened', group]) || [];
                const index = items.findIndex(item => item.id === action.id);
                if (index !== -1) {
                    return _set(state, `opened.${group}.${index}.isClosing`, true);
                }
                return state;
            })();

        case MODAL_CLOSE:
            return (() => {
                const group = action.group || MODAL_DEFAULT_GROUP;
                const items = _get(state, ['opened', group]) || [];
                const index = items.findIndex(item => item.id === action.id);
                if (index !== -1) {
                    return _delete(state, `opened.${group}.${index}`);
                }
                return state;
            })();

        default:
            return state;
    }
};

export const getOpened = (
    state,
    group = MODAL_DEFAULT_GROUP,
): IModal[] => _get(state, ['modal', 'opened', group]) || null;
