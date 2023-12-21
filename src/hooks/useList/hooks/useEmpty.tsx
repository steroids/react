import React from 'react';
import {IList} from '../../../actions/list';
import Empty, {normalizeEmptyProps} from '../../../ui/list/Empty/Empty';
import {IListConfig} from '../useList';

/**
 * Генерирует функцию, которая используется для рендеринга пустого отображения.
 *
 * @param {IListConfig} config - конфигурация для списка.
 * @param {IList} list - список.
 * @return {{renderEmpty: () => JSX.Element | null}} возвращает функцию, которая используется для рендеринга пустого отображения.
 */
export default function useEmpty(config: IListConfig, list: IList) {
    const emptyProps = normalizeEmptyProps(config.empty);
    const renderEmpty = () => {
        if (!emptyProps.enable || list?.isLoading || list?.items?.length > 0) {
            return null;
        }

        return (
            <Empty
                list={list}
                {...emptyProps}
            />
        );
    };

    return {renderEmpty};
}
