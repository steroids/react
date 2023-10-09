import {useCallback, useMemo} from 'react';
import _get from 'lodash-es/get';
import * as React from 'react';
import {IButtonProps} from '../../form/Button/Button';
import {useComponents} from '../../../hooks';
import useForm from '../../../hooks/useForm';
import {formChange} from '../../../actions/form';
import {ListControlPosition} from '../../../hooks/useList';

/**
 * PaginationSize
 * Компонент для выбора количества элементов в списке
 */
export interface IPaginationSizeProps extends IUiComponent {
    /**
     * Подключить выбор количества элементов
     * @example true
     */
    enable?: boolean,

    /**
     * Аттрибут (название) поля в форме
     * @example pageSize
     */
    attribute?: string,

    /**
     * Список с количествами элементов на странице
     * @example [2, 3, 4]
     */
    sizes?: number[];

    /**
     * Расположение элемента в списке
     * @example 'both'
     */
    position?: ListControlPosition,

    /**
     * Значение по-умолчанию
     */
    defaultValue?: number;

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

    /**
     * Свойства для кнопок пагинации
     */
    buttonProps?: IButtonProps,

    [key: string]: any,
}

export interface IPaginationSizeViewProps extends IPaginationSizeProps {
    items: {
        id: number,
        label: string | number,
    }[],
    onSelect: (size: number) => void,
}

function PaginationSize(props: IPaginationSizeProps): JSX.Element {
    const components = useComponents();

    const items = useMemo(() => props.sizes.map(size => ({
        id: size,
        label: size,
    })), [props.sizes]);

    const {formId, formDispatch} = useForm();

    const onSelect = useCallback((newPage) => {
        if (formDispatch) {
            formDispatch(formChange(formId, props.attribute, newPage));
        }

        if (props.onChange && newPage) {
            props.onChange.call(null, newPage);
        }
    }, [formDispatch, formId, props.attribute, props.onChange]);

    if (!props.list?.items?.length) {
        return null;
    }

    return components.ui.renderView(props.view || 'list.PaginationSizeView', {
        ...props,
        items,
        onSelect,
    });
}

PaginationSize.defaultProps = {
    enable: false,
    attribute: 'pageSize',
    sizes: [30, 50, 100],
    defaultValue: 50,
    position: 'top',
    buttonProps: {
        size: 'sm',
    },
};

export const normalizePaginationSizeProps = props => ({
    ...PaginationSize.defaultProps,
    enable: !!props,
    defaultValue: _get(props, 'sizes.0') || PaginationSize.defaultProps.defaultValue,
    ...(typeof props === 'boolean' ? {enable: props} : props),
});

export default React.memo(PaginationSize);
