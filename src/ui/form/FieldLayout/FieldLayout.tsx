import * as React from 'react';
import _get from 'lodash-es/get';
import {useComponents, useForm} from '../../../hooks';

/**
 * FieldLayout
 *
 * Специальный шаблон для поля, который настраивает его расположение внутри формы, рендерит лейбл, подсказки и ошибки.
 *
 */
export interface IFieldLayoutProps extends IUiComponent {
    /**
     * Название поля либо отмена отображение поля (false)
     * @example 'Visible'
     */
    label?: string | boolean | any,

    /**
     * Подсказка, которая отображается, когда в поле нет ошибок
     * @example 'Save'
     */
    hint?: string | boolean,

    /**
     * Обязательное ли поле? Если true,
     * то к названию будет добавлен модификатор 'required' - красная звездочка (по умолчанию)
     * @example true
     */
    required?: boolean,

    /**
     * Ошибки в поле
     * @example 'Field is required'
     */
    errors?: string[],

    /**
     * Отображать ли состояние successful на поле
     * @example 'true'
     */
    successful?: boolean,

    [key: string]: any,
}

export interface IFieldLayoutViewProps {
    label: string | boolean | any,
    required: boolean,
    hint: string | boolean,
    errors: string[],
    successful: boolean,
    id: string,
    size: Size,
    children?: React.ReactNode,
    className?: string,
}

function FieldLayout(props: IFieldLayoutProps): JSX.Element {
    const components = useComponents();

    // Error from state
    const errors = useForm().formSelector(state => _get(state, 'errors.' + props.attribute));

    return components.ui.renderView(props.view || 'form.FieldLayoutView', {
        ...props,
        errors: props.errors || errors,
    });
}

export default React.memo(FieldLayout);
