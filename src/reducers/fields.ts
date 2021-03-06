import _isString from 'lodash-es/isString';
import _get from 'lodash-es/get';
import {FIELDS_SET_META} from '../actions/fields';

const initialState = {
    props: {},
    meta: null,
};
const normalizeName = name => name.replace(/\\/g, '.').replace(/^\./, '');
export default (state = initialState, action) => {
    switch (action.type) {
        case FIELDS_SET_META:
            Object.keys(action.meta).forEach(name => {
                action.meta[name].className = name;
            });
            return {
                ...state,
                meta: {
                    ...state.meta,
                    ...action.meta,
                },
            };
        default:
            return state;
    }
};

export const isMetaFetched = state => _get(state, ['fields', 'meta']) !== null;
export const getEnumLabels = (state, name) => _get(state, ['fields', 'meta', name, 'labels']) || null;
const warnings = {};
export const getModel = (state, name) => {
    if (_isString(name)) {
        name = normalizeName(name);
        const meta = _get(state, ['fields', 'meta', name]) || null;
        if (!meta && isMetaFetched(state) && !warnings[name]) {
            warnings[name] = true;
            console.warn('Steroids: Not found model meta:', name); // eslint-disable-line no-console
        }
        return meta;
    }
    return name || null;
};
