import _get from 'lodash-es/get';
import {useComponents} from '@steroidsjs/core/hooks';
import {useCallback, useMemo} from 'react';
import useForm from '@steroidsjs/core/hooks/useForm';
import {formChange} from '@steroidsjs/core/actions/form';
import * as React from 'react';
import {ListControlPosition} from '../../../hooks/useList';
import {IButtonProps} from '../../form/Button/Button';
import {IList} from '@steroidsjs/core/actions/list';

export interface IPaginationProps {
    attribute?: string,
    sizeAttribute?: string,
    aroundCount?: number;
    loadMore?: boolean,
    className?: CssClassName;
    position?: ListControlPosition,
    buttonProps?: IButtonProps,
    view?: CustomView,
    onChange?: (value: number) => void,
    /**
     * Размер
     */
    size?: Size,

    /**
     * Темная тема
     */
    dark?: boolean,

    [key: string]: any,
}

export interface IPaginationViewProps extends IPaginationProps {
    totalPages: number,
    pages: {
        page?: number,
        label: string,
        isActive: boolean,
    }[],
    onSelect: (page: number) => void,
    onSelectNext: () => void,
}

export const generatePages = (page, totalPages, aroundCount = 3) => {
    if (!page || !totalPages) {
        return [];
    }

    const pages = [];
    for (let i = 1; i <= totalPages; i += 1) {
        // Store first and last
        if (i === 1 || i === totalPages || (page - aroundCount < i && i < page + aroundCount)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
        }
    }
    return pages;
};

function Pagination(props: IPaginationProps) {
    const components = useComponents();

    if (!props.list) {
        return null;
    }

    const initialValues = {
        page: props.list[props.attribute],
        pageSize: props.list[props.sizeAttribute]
    };

    const {formId, formDispatch, formSelector} = useForm();
    const {page, pageSize} = formSelector(({values}) => ({
        page: _get(values, props.attribute),
        pageSize: _get(values, props.sizeAttribute),
    })) || initialValues;

    const totalPages = Math.ceil((props.list.total || 0) / (pageSize || 1));

    const pages = useMemo(
        () => generatePages(page, totalPages, props.aroundCount).map(pageItem => ({
            page: pageItem !== '...' ? pageItem : null,
            label: pageItem,
            isActive: page === pageItem,
        })),
        [page, props.aroundCount, totalPages],
    );

    const onSelect = useCallback((newPage) => {
        formDispatch && formDispatch(formChange(formId, props.attribute, newPage));
        if (props.onChange && newPage) {
            props.onChange.call(null, newPage);
        }
    }, [formDispatch, formId, props.attribute, props.onChange]);

    const onSelectNext = useCallback(() => {
        onSelect(page + 1);
    }, [onSelect, page]);

    if (!page || !pageSize || props.list.total <= pageSize) {
        return null;
    }

    // Do not show in last page in 'loadMore' mode
    if (props.loadMore && page >= totalPages) {
        return null;
    }

    const defaultView = (props.loadMore ? 'list.PaginationMoreView' : 'list.PaginationButtonView');
    return components.ui.renderView(props.view || defaultView, {
        totalPages,
        pages,
        onSelect,
        onSelectNext,
    });
}

Pagination.defaultProps = {
    enable: true,
    attribute: 'page',
    aroundCount: 3,
    defaultValue: 1,
    loadMore: false,
    position: 'bottom',
    sizeAttribute: 'pageSize',
};

export const normalizePaginationProps = props => ({
    ...Pagination.defaultProps,
    ...(typeof props === 'boolean' ? {enable: props} : props),
});

export default React.memo(Pagination);
