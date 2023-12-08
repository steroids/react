import React from 'react';
import {Model} from '../../../components/MetaComponent';
import {IListConfig} from '../useList';

export default function useSearchForm(config: IListConfig, list: any, initialQuery: Record<string, unknown>, searchModel: Model) {
    const searchFormFields = config.searchForm?.fields;
    const SearchForm = require('../../../ui/list/SearchForm').default;
    const initialValuesSearchForm = React.useMemo(() => (searchFormFields || []).reduce((acc, field) => {
        const attribute = typeof field === 'string' ? field : field.attribute;
        acc[attribute] = initialQuery?.[attribute];
        return acc;
    }, {}), [searchFormFields, initialQuery]);

    const searchFormProps = {
        listId: config.listId,
        ...config.searchForm,
        model: searchModel,
        initialValues: initialValuesSearchForm,
    };

    const renderSearchForm = () => <SearchForm {...searchFormProps} />;

    return {
        renderSearchForm,
    };
}
