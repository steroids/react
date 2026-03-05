import _get from 'lodash-es/get';
import _isString from 'lodash-es/isString';

import {
    FIELDS_SET_META,
    FIELDS_DATA_PROVIDER_SET_ITEMS,
} from '../actions/fields';

export interface IFieldsState {
    props: Record<string, any>,
    dataProvider: Record<string, any>,
    meta: Record<string, any> | null,
}

const initialState: IFieldsState = {
    props: {},
    dataProvider: {},
    meta: null,
};

export const normalizeName = name => name.replace(/\\/g, '.').replace(/^\./, '');
// eslint-disable-next-line default-param-last
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

        case FIELDS_DATA_PROVIDER_SET_ITEMS:
            return {
                ...state,
                dataProvider: {
                    ...state.dataProvider,
                    [action.dataProviderId]: action.items,
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

export const getDataProviderItems = (state, dataProviderId) => state?.fields?.dataProvider?.[dataProviderId] || null;
