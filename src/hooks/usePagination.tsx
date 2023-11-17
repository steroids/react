import React from 'react';
import {normalizePaginationSizeProps} from '../ui/list/PaginationSize/PaginationSize';
import {normalizePaginationProps} from '../ui/list/Pagination/Pagination';
import {IListConfig} from './useList';

export default function usePagination(config: IListConfig, list: any) {
    // Pagination size
    const PaginationSize = require('../ui/list/PaginationSize').default;
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
    const Pagination = require('../ui/list/Pagination').default;
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
