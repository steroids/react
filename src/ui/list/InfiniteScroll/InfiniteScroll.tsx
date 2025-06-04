import React, {memo, useCallback, useRef, useState} from 'react';
import _get from 'lodash-es/get';
import useForm from '../../../hooks/useForm';
import {formChange} from '../../../actions/form';
import {useIntersectionObserver} from './hooks';

/**
 * InfiniteScroll
 * Компонент с бесконечным скроллом страниц.
 */
export interface IInfiniteScrollProps {
    /**
     * Подключить бесконечный скролл
     * @example true
     */
    enable?: boolean,

    /**
     * Аттрибут (название) в форме для поля с номером текущей страницы
     * @example page
     */
    pageAttribute?: string,

    /**
     * Аттрибут (название) в форме для поля с флагом, определяющим есть ли следующая страница
     * @example hasNextPage
     */
    hasNextPageAttribute?: string,

    /**
     * Обработчик, который вызывается после смены страницы
     * @param {number} value
     * @return {void}
     */
    onChange?: (value: number) => void,

    /**
     * Список, для которого используется пагинация
     */
    list?: any,

    [key: string]: any,
}

function InfiniteScroll(props: IInfiniteScrollProps): JSX.Element {
    const observerTarget = useRef(null);

    const [isScrollRefSet, setIsScrollRefSet] = useState(false);

    const setScrollContainerRef = useCallback((scrollContainerNode) => {
        if (scrollContainerNode) {
            observerTarget.current = scrollContainerNode;
            setIsScrollRefSet(true);
        }
    }, []);

    const initialValues = {
        page: props.list?.[props.pageAttribute],
    };

    const {
        formId,
        formDispatch,
        formSelector,
    } = useForm();

    const {
        page,
    } = formSelector(({values}) => ({
        page: _get(values, props.pageAttribute),
    })) || initialValues;

    const onScrollFetch = useCallback(() => {
        const nextPage = page + 1;

        if (formDispatch) {
            formDispatch(formChange(formId, props.pageAttribute, nextPage));
        }
        if (props.onChange) {
            props.onChange(nextPage);
        }
    }, [formDispatch, formId, page, props]);

    useIntersectionObserver({
        target: observerTarget,
        onIntersect: () => onScrollFetch(),
        enabled: Boolean(!props.list.isLoading && props.list?.[props.hasNextPageAttribute] && isScrollRefSet),
    });

    return <div ref={setScrollContainerRef} />;
}

InfiniteScroll.defaultProps = {
    enable: false,
    pageAttribute: 'page',
    hasNextPageAttribute: 'hasNextPage',
};

export const normalizeInfiniteScrollProps = props => ({
    ...InfiniteScroll.defaultProps,
    ...(typeof props === 'boolean' ? {enable: props} : props),
});

export default memo(InfiniteScroll);
