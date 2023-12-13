import React from 'react';
import {Model} from '../../../components/MetaComponent';
import {IListConfig} from '../useList';
import SearchForm from '../../../ui/list/SearchForm';

/**
 * Генерирует функцию, которая отображает форму поиска с заданными опциями.
 *
 * @param {IListConfig} config - конфигурация для списка.
 * @param {Record<string, unknown>} initialQuery - изначальные значения для формы.
 * @param {Model} searchModel - поисковая модель.
 * @return {object} объект с функцией, которая отображает форму поиска.
 */
export default function useSearchForm(config: IListConfig, initialQuery: Record<string, unknown>, searchModel: Model) {
    const searchFormFields = config.searchForm?.fields;
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
