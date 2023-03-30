import _get from 'lodash-es/get';
import {useCallback, useMemo} from 'react';
import * as React from 'react';
import {useComponents} from '../../../hooks';
import useForm from '../../../hooks/useForm';
import {formChange} from '../../../actions/form';
import {ListControlPosition} from '../../../hooks/useList';
import {IButtonProps} from '../../form/Button/Button';

/**
 * Pagination
 * Компонент с пагинацией страниц.
 */
export interface IPaginationProps {
    /**
     * Подключить пагинацию
     * @example true
     */
    enable?: boolean,

    /**
     * Значение по-умолчанию
     */
    defaultValue?: number;

    /**
     * Аттрибут (название) в форме для поля пагинации
     * @example page
     */
    attribute?: string,

    /**
     * Аттрибут (название) в форме для поля с количеством элементов на странице
     * @example pageSize
     */
    sizeAttribute?: string,

    /**
     * Указывает, какое количество кнопок с номерами страниц будет доступно до и после выбранной страницы,
     * включая выбранную. Остальные будут спрятаны в элемент "..."
     * @example 5
     */
    aroundCount?: number;

    /**
     * Вместо списка с номерами страниц будет кнопка "Загрузить еще"
     * @example true
     */
    loadMore?: boolean,

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName;

    buttonProps?: IButtonProps,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,

    /**
     * Обработчик, который вызывается после смены страницы
     * @param {number} value
     * @return {void}
     */
    onChange?: (value: number) => void,

    /**
     * Размер
     */
    size?: Size,

    /**
     * Темная тема
     */
    dark?: boolean,

    /**
     * Список, для которого используется пагинация
     */
    list?: any,

    /**
    * Нужно ли отображать кнопки с шагом в одну страницу
    * @example {'true'}
    */
    showSteps?: boolean,

    /**
     * Нужно ли отображать кнопки с шагом до первой / последней страницы
     * @example {'true'}
     */
    showEdgeSteps?: boolean,

    /**
     * Флаг который переводит Pagination в выключенное состояние
     */
    disabled?: boolean,

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
    onSelectPrev: () => void,
    onSelectLast: () => void,
    onSelectFirst: () => void,
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

function Pagination(props: IPaginationProps): JSX.Element {
    const components = useComponents();

    const initialValues = {
        page: props.list?.[props.attribute],
        pageSize: props.list?.[props.sizeAttribute],
    };

    const {
        formId,
        formDispatch,
        formSelector,
    } = useForm();

    const {
        page,
        pageSize,
    } = formSelector(({values}) => ({
        page: _get(values, props.attribute),
        pageSize: _get(values, props.sizeAttribute),
    })) || initialValues;

    const totalPages = Math.ceil((props.list?.total || 0) / (pageSize || 1));

    const pages = useMemo(
        () => generatePages(page, totalPages, props.aroundCount)
            .map((pageItem, index, pagesArray) => {
                // Номер страницы для '...' кнопки (выбирает страницу между двумя соседними пронумерованными)
                const pageNumberForButtonWithDots = Math.floor(((pagesArray[index + 1] + pagesArray[index - 1]) / 2));
                return {
                    page: pageItem !== '...' ? pageItem : pageNumberForButtonWithDots,
                    label: pageItem,
                    isActive: page === pageItem,
                };
            }),
        [page, props.aroundCount, totalPages],
    );

    const onSelect = useCallback((newPage) => {
        if (formDispatch) {
            formDispatch(formChange(formId, props.attribute, newPage));
        }
        if (props.onChange && newPage) {
            props.onChange.call(null, newPage);
        }
    }, [formDispatch, formId, props.attribute, props.onChange]);

    const onSelectNext = useCallback(() => {
        onSelect(page + 1);
    }, [onSelect, page]);

    const onSelectPrev = useCallback(() => {
        onSelect(page - 1);
    }, [onSelect, page]);

    const onSelectLast = useCallback(() => {
        onSelect(totalPages);
    }, [onSelect, totalPages]);

    const onSelectFirst = useCallback(() => {
        onSelect(1);
    }, [onSelect]);

    if (!props.list || !page || !pageSize || props.list.total <= pageSize) {
        return null;
    }

    // Do not show in last page in 'loadMore' mode
    if (props.loadMore && page >= totalPages) {
        return null;
    }

    const defaultView = (props.loadMore ? 'list.PaginationMoreView' : 'list.PaginationButtonView');
    return components.ui.renderView(props.view || defaultView, {
        ...props,
        totalPages,
        pages,
        onSelect,
        onSelectNext,
        onSelectPrev,
        onSelectLast,
        onSelectFirst,
    });
}

Pagination.defaultProps = {
    enable: true,
    attribute: 'page',
    aroundCount: 3,
    defaultValue: 1,
    size: 'md',
    loadMore: false,
    position: 'bottom',
    sizeAttribute: 'pageSize',
};

export const normalizePaginationProps = props => ({
    ...Pagination.defaultProps,
    ...(typeof props === 'boolean' ? {enable: props} : props),
});

export default React.memo(Pagination);
