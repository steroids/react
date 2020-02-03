import _get from 'lodash-es/get';
import _values from 'lodash-es/values';
import {OPEN_MODAL, CLOSE_MODAL} from '../actions/modal';

const initialState = {
    opened: {}
};
export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_MODAL:
            return {
                opened: {
                    ...state.opened,
                    [action.id]: {
                        id: action.id,
                        modal: action.modal,
                        props: {
                            ..._get(state, `opened.${action.id}.props`),
                            ...action.props
                        }
                    }
                }
            };
        case CLOSE_MODAL:
            if (action.id) {
                const opened = state.opened;
                delete opened[action.id];
                return {
                    opened
                };
            } else {
                return {
                    opened: {}
                };
            }
        default:
            return state;
    }
};
export const getOpened = state => _values(state.modal.opened);
