import React from 'react';
import PaginationSize, {normalizePaginationSizeProps} from '../../../ui/list/PaginationSize/PaginationSize';
import Pagination, {normalizePaginationProps} from '../../../ui/list/Pagination/Pagination';
import {IListConfig} from '../useList';
import {IList} from '../../../actions/list';

/**
 * Генерирует объект пагинации списка основываясь на переданной конфигурации.
 *
 * @param {IListConfig} config - конфигурация для списка.
 * @param {IList} list - список.
 * @return {Object} объект, который содержит функции для отображения пагинации, свойства пагинации и свойства размера пагинации.
 */
export default function usePagination(config: IListConfig, list: IList) {
    // Pagination size
    const paginationSizeProps = normalizePaginationSizeProps(config.paginationSize);
    const renderPaginationSize = () => paginationSizeProps.enable
        ? (
            <PaginationSize
                list={list}
                {...paginationSizeProps}
            />
        )
        : null;

    // Pagination
    const paginationProps = normalizePaginationProps(config.pagination);
    const renderPagination = () => paginationProps.enable
        ? (
            <Pagination
                list={list}
                {...paginationProps}
                sizeAttribute={paginationSizeProps.attribute}
            />
        )
        : null;

    return {
        renderPaginationSize,
        renderPagination,
        paginationProps,
        paginationSizeProps,
    };
}
