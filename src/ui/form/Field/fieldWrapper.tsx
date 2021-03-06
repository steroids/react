import _has from 'lodash-es/has';
import _upperFirst from 'lodash-es/upperFirst';
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
     * Подсказка для поля
     * @example Your text...
     */
    placeholder?: string;

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
    errors?: string[];

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
    errors?: string[],
    input?: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
    },
}

interface IFieldWrapperOptions {
    label?: boolean,
    list?: boolean,
    attributeSuffixes?: string[],
}

type FieldWrapperComponent = {
    (props: IFieldWrapperInputProps): JSX.Element;
    WrappedComponent: any;
    displayName: any;
    defaultProps: any;
}

const getKey = (baseName, attribute) => baseName + _upperFirst(attribute || '');

const createDynamicField = (componentId, Component, options: IFieldWrapperOptions) => {
    const DynamicField = (props: IFieldWrapperInputProps) => {
        const components = useComponents();

        // Get context, formId
        const context = useContext(FormContext);
        const formId = props.formId || context?.formId || null;
        const model = props.model || context?.model || null;

        // Result wrapper props
        const wrapperProps: IFieldWrapperOutputProps = {
            componentId,
            formId,
        };

        options.attributeSuffixes.forEach(suffix => {
            const attributeKey = getKey('attribute', suffix);
            const inputKey = getKey('input', suffix);
            const errorsKey = getKey('errors', suffix);

            // Get full name (attribute with prefix)
            const name = [props.prefix, props[attributeKey]].filter(Boolean).join('.');

            // Register field
            components.ui.registerField(formId, name, componentId);

            // Resolve data provider
            const {errors, value, setValue} = context?.provider
                ? context?.provider.useField(formId, name, options.list)
                : providers.state.useField(props.value);

            // Set errors
            wrapperProps[errorsKey] = errors;

            // Input object
            wrapperProps[inputKey] = useMemo(() => ({ // eslint-disable-line react-hooks/rules-of-hooks
                name,
                value,
                onChange: setValue,
            }), [name, setValue, value]);
        });

        return components.ui.renderView(Component, {
            ...components.ui.getFieldProps(componentId, model, props.attribute),
            ...props,
            ...wrapperProps,
        });
    };
    DynamicField.displayName = componentId;
    DynamicField.defaultProps = Component.defaultProps;
    return DynamicField;
};

// Field Wrapper
export default function fieldWrapper(
    componentId,
    Component: any,
    optionsConfig: IFieldWrapperOptions = {
        attributeSuffixes: [''],
    },
): FieldWrapperComponent {
    const options = {
        ...optionsConfig,
        attributeSuffixes: optionsConfig.attributeSuffixes || [''],
    };

    const NewComponent = (props: IFieldWrapperInputProps):JSX.Element => {
        const components = useComponents();

        // Get context, formId
        const context = useContext(FormContext);
        const model = props.model || context?.model || null;

        const attributesProps = options.attributeSuffixes.reduce((obj, suffix) => {
            const attributeKey = getKey('attribute', suffix);
            obj[attributeKey] = props[attributeKey];
            return obj;
        }, {});
        const attribute = Object.values(attributesProps)[0];

        // Get UI props and create Field Class dynamically (for add field props - input, errors, model, ...)
        const metaProps = useMemo(
            () => components.ui.getFieldProps(componentId, model, attribute),
            [components.ui, attribute, model],
        );
        if (!Component.DynamicField) {
            Component.DynamicField = createDynamicField(componentId, Component, options);
        }

        // Resolve layout
        const layout = useMemo(() => mergeLayoutProp(context.layout, props.layout), [context.layout, props.layout]);

        if (layout !== null) {
            return components.ui.renderView(FieldLayout, {
                ...attributesProps,
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
