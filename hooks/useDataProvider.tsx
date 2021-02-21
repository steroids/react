import * as React from 'react';
import _isArray from 'lodash-es/isArray';
import _isFunction from 'lodash-es/isFunction';
import _includes from 'lodash-es/includes';

import {normalizeItems} from '../utils/data';
import {useEffect, useState } from 'react';
import {useComponents} from './index';

/**
 * Data Provider HOC
 * Подготавливает коллекции данных для полей форм. Используется в выпадающих списках, чекбоксах, автокомплитах и т.п.
 * Позволяет передать данные несколькими видами (enum, list, object, data provider), а на выход предоставит единый вид
 * данных. Поддерживает подгрузку данных из вне (при autocomplete), поиск по данным, множественный выбор.
 */

const findSelectedItems = (items, value, valueItemKey) => {
    const selectedValues = value === false || value === 0 ? [value] : [].concat(value || []);
    return items.filter(item => _includes(selectedValues, item[valueItemKey]));
};

const useSearchDataProvider = (props, config = {
    query: '',
    value: null,
    isAutoFetch: false,
    dataProviderParams: null,
    valueItemKey: 'id',
}) => {
    const components = useComponents();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const {query, value, isAutoFetch, dataProviderParams, valueItemKey} = config;
            if (!value && !isAutoFetch && query.length < props._autoComplete.minLength) {
                return;
            }
            const searchHandler = props.dataProvider.onSearch || components.http.post.bind(components.http);
            const searchParams = dataProviderParams || props.dataProvider.params;
            const result = searchHandler(props.dataProvider.action, {
                query,
                value,
                model: props.model,
                attribute: props.attribute,
                ...searchParams,
            });

            if (result && _isFunction(result.then)) {
                setIsLoading(true);
                result.then(items => {
                    items = normalizeItems(items);
                    setIsLoading(false);
                    setData(prevState => ({
                        items,
                        sourceItems: isAutoFetch ? items : prevState.sourceItems,
                        selectedItems: value ? findSelectedItems(items, value, valueItemKey) : prevState.selectedItems
                    }));
                });
            }

            if (_isArray(result)) {
                const items = normalizeItems(result);
                setData(prevState => ({
                    items,
                    sourceItems: isAutoFetch ? items : prevState.sourceItems,
                    selectedItems: value ? findSelectedItems(items, value, valueItemKey) : prevState.selectedItems
                }));
            }
        };

        fetchData();
    }, [props.dataProvider, props.autoFetch, props.input]);

    return {data, setData, isLoading};
};
