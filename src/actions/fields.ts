export const FIELDS_SET_META = 'FIELDS_SET_META';
export const FIELDS_DATA_PROVIDER_SET_ITEMS = '@fields/data_provider_set_items';

export const setMeta = meta => ({
    type: FIELDS_SET_META,
    meta,
});

export const fieldsDataProviderSetItems = (dataProviderId, items) => ({
    type: FIELDS_DATA_PROVIDER_SET_ITEMS,
    dataProviderId,
    items,
});
