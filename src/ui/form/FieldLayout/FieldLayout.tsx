import * as React from 'react';
import _get from 'lodash-es/get';
import {useMemo} from 'react';
import {useComponents, useForm} from '../../../hooks';
import {mergeLayoutProp} from '../../../utils/form';

/**
 * FieldLayout
 * Специальный шаблон для поля, который настраивает его расположение внутри формы, рендерит лейбл, подсказки и ошибки
 */
export interface IFieldLayoutProps {

    /**
     * Название поля либо отмена отображение поля (false)
     * @example 'Visible'
     */
    label?: string | boolean | any;

    /**
     * Подсказка, которая отображается, когда в поле нет ошибок и layout !== 'inline'
     * @example 'Save'
     */
    hint?: string | boolean;

    /**
     * Обязательное ли поле? Если true,
     * то к названию будет добавлен модификатор 'required' - красная звездочка (по умолчанию)
     * @example true
     */
    required?: boolean;

    /**
     * Выбор шаблона для расположения поля. Если false, то поле будет отрендерено без шаблона
     * @example 'inline'
     */
    layout?: FormLayout;

    /**
     * Ошибки в поле
     * @example 'Field is required'
     */
    error?: string | string[];

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    layoutView?: CustomView;

    [key: string]: any;
}

export interface IFieldLayoutViewProps {
    label: string | boolean | any,
    required: boolean,
    hint: string | boolean,
    errors: string | string[],
    layout?: {
        layout: FormLayoutName | boolean,
        className: string,
        label: boolean,
        cols: number[],
        [key: string]: any,
    },
    children?: React.ReactNode
}

const defaultProps = {
    layout: {
        layout: 'default',
        cols: [3, 6],
    },
};

function FieldLayout(props: IFieldLayoutProps): JSX.Element {
    const components = useComponents();

    const layout = useMemo(() => mergeLayoutProp(defaultProps.layout, props.layout), [props.layout]);
    if (layout === false) {
        return props.children;
    }

    // Error from state
    const error = useForm().formSelector(state => _get(state, 'errors.' + props.attribute));

    return components.ui.renderView(props.layoutView || 'form.FieldLayoutView', {
        ...props,
        errors: props.error || error,
        layout,
    });
}

export default React.memo(FieldLayout);
