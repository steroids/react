import _has from 'lodash-es/has';
import {useContext, useMemo} from 'react';
import * as React from 'react';
import {mergeLayoutProp, providers} from '../../../utils/form';
import {FormContext} from '../Form/Form';
import FieldLayout from '../FieldLayout/FieldLayout';
import {useComponents} from '../../../hooks';

export interface IFieldWrapperInputProps {
    /**
     * Префикс, который добавится к аттрибуту (названию) поля в форме
     */
    prefix?: string | boolean;

    /**
     * Название поля либо отмена отображение поля (false)
     * @example 'Visible'
     */
    label?: string | boolean | any;

    /**
     * Аттрибут (название) поля в форме
     * @example 'isVisible'
     */
    attribute?: string;

    /**
     * Модель с полями формы
     * @example {attributes: [{attribute: 'category', field: 'DropDownField'}]}
     */
    model?: string | ((...args: any[]) => any) | any;

    /**
     * Подсказка, которая отобразится рядом с полем
     * @example 'Only english letters'
     */
    hint?: string;

    /**
     * Обязательное ли поле? Если true, то к названию будет добавлен
     * модификатор 'required' - красная звездочка (по умолчанию)
     * @example true
     */
    required?: boolean;

    /**
     * Переводит элемент в состояние "не активен"
     * @example true
     */
    disabled?: boolean;

    /**
     * Шаблон для поля, который настраивает его расположение внутри формы.
     * Если false, то поле будет отрендерено без шаблона.
     * @example 'horizontal'
     */
    layout?: FormLayout;

    onChange?: (...args: any[]) => any;

    /**
     * Ошибки в поле
     * @example ['Error text']
     */
    errors?: any;

    date?: any;

    /**
     * Темная тема
     */
    dark?: boolean,

    /**
     * Размер поля
     */
    size?: Size,

    [key: string]: any,
}

export interface IFieldWrapperOutputProps {
    formId?: string,
    componentId?: string,
    errors?: any,
    input?: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
    },
}

interface IFieldWrapperOptions {
    label?: boolean,
    list?: boolean,
}

const createDynamicField = (componentId, Component, isList) => {
    const DynamicField = (props: IFieldWrapperInputProps) => {
        const components = useComponents();

        // Get full name (attribute with prefix)
        const name = [props.prefix, props.attribute].filter(Boolean).join('.');

        // Get context, formId
        const context = useContext(FormContext);
        const formId = props.formId || context?.formId || null;
        const model = props.model || context?.model || null;

        // Resolve data provider
        const {errors, value, setValue} = context?.provider
            ? context?.provider.useField(formId, name, isList)
            : providers.state.useField(props.value);

        // Input object
        const input = useMemo(() => ({
            name,
            value,
            onChange: setValue,
        }), [name, setValue, value]);

        // Result wrapper props
        const wrapperProps: IFieldWrapperOutputProps = {
            componentId,
            formId,
            errors,
            input,
        };

        return components.ui.renderView(Component, {
            ...components.ui.getFieldProps(componentId, model, props.attribute),
            ...wrapperProps,
            ...props,
        });
    };
    DynamicField.displayName = componentId;
    DynamicField.defaultProps = Component.defaultProps;
    return DynamicField;
};

// Field Wrapper
export default function fieldWrapper<T extends React.FC>(
    componentId,
    Component: T | any,
    options: IFieldWrapperOptions = {},
) {
    const NewComponent = (props: IFieldWrapperInputProps): T | any => {
        const components = useComponents();

        // Get UI props and create Field Class dynamically (for add field props - input, error, model, ...)
        const metaProps = useMemo(
            () => components.ui.getFieldProps(componentId, props.model, props.attribute),
            [components.ui, props.attribute, props.model],
        );
        if (!Component.DynamicField) {
            Component.DynamicField = createDynamicField(componentId, Component, options.list);
        }

        // Resolve layout
        const context = useContext(FormContext);
        const layout = useMemo(() => mergeLayoutProp(context.layout, props.layout), [context.layout, props.layout]);

        if (layout !== false) {
            return components.ui.renderView(FieldLayout, {
                layout,
                required: _has(props, 'required') ? props.required : metaProps.required,
                label: options.label === false ? null : (_has(props, 'label') ? props.label : metaProps.label),
                hint: _has(props, 'hint') ? props.hint : metaProps.hint,
                errors: props.errors,
                children: (
                    <Component.DynamicField {...props} />
                ),
            });
        }

        return components.ui.renderView(Component.DynamicField, props);
    };

    NewComponent.WrappedComponent = Component;
    NewComponent.displayName = componentId;
    NewComponent.defaultProps = Component.defaultProps;
    return NewComponent;
}
