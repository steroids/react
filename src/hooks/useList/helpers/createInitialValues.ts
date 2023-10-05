export const createInitialValues = ({
    paginationProps,
    paginationSizeProps,
    sort,
    layoutNamesProps,
    initialQuery,
    configQuery,
}) => ({
    [paginationProps.attribute]: paginationProps.defaultValue,
    [paginationSizeProps.attribute]: paginationSizeProps.defaultValue,
    [sort.attribute]: sort.defaultValue,
    [layoutNamesProps.attribute]: layoutNamesProps.defaultValue,
    // TODO [this.props._layout.attribute]:
    //  this.props.clientStorage.get(this.props._layout.attribute) || this.props._layout.defaultValue,
    ...initialQuery, // Address bar
    ...configQuery, // Query from props
});
