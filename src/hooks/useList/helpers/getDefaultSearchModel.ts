export const getDefaultSearchModel = ({
    paginationProps,
    paginationSizeProps,
    sort,
    layoutNamesProps,
}) => ({
    attributes: [ // default attributes
        paginationProps.enable && {
            type: 'number',
            attribute: paginationProps.attribute,
            defaultValue: paginationProps.defaultValue,
        },
        paginationSizeProps.enable && {
            type: 'number',
            attribute: paginationSizeProps.attribute,
            defaultValue: paginationSizeProps.defaultValue,
        },
        sort.enable && {
            type: 'string', // TODO Need list of strings
            jsType: 'string[]',
            attribute: sort.attribute,
            defaultValue: sort.defaultValue,
        },
        layoutNamesProps.enable && {
            type: 'string',
            attribute: layoutNamesProps.attribute,
            defaultValue: layoutNamesProps.defaultValue,
        },
    ].filter(Boolean),
});
