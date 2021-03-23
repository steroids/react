import _has from 'lodash-es/has';
import { useContext, useMemo} from 'react';
import * as React from 'react';
import {mergeLayoutProp, providers} from '../../../utils/form';
import {FormContext} from '../Form/Form';
import FieldLayout from '../FieldLayout/FieldLayout';
import {useComponents} from '../../../hooks';

export interface IFieldWrapperInputProps {

    prefix?: string | boolean;

    /**
     * Название поля либо отмена отображение поля (false)
     * @example Visible
     */
    label?: string | boolean | any;

    /**
     * Аттрибут (название) поля в форме
     * @example isVisible
     */
    attribute?: string;
    model?: string | ((...args: any[]) => any) | any;
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
    layout?: FormLayout;
    onChange?: (...args: any[]) => any;
    errors?: any;
    date?: any;

    dark?: boolean,
    size?: Size,

    [key: string]: any,
}

export interface IFieldWrapperOutputProps {
    formId?: string,
    componentId?: string,
    error?: any,
    input?: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
    },
}

interface IFieldWrapperOptions {
    label?: boolean,
}

const createDynamicField = (componentId, Component) => {
    const DynamicField = (props: IFieldWrapperInputProps) => {
        const components = useComponents();

        // Get full name (attribute with prefix)
        const name = [props.prefix, props.attribute].filter(Boolean).join('.');

        // Get context, formId
        const context = useContext(FormContext);
        const formId = props.formId || context?.formId || null;
        const model = props.model || context?.model || null;

        // Resolve data provider
        const {error, value, setValue} = context?.globalState
            ? providers.redux.useField(formId, name)
            : (context?.reducer
                ? providers.reducer.useField(formId, name)
                : providers.state.useField(props.value)
            );

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
            error,
            input,
        };

        return components.ui.renderView(Component, {
            ...props,
            ...components.ui.getFieldProps(componentId, model, props.attribute),
            ...wrapperProps,
        });
    };
    DynamicField.displayName = componentId;
    return DynamicField;
};

// Field Wrapper
export default function fieldWrapper<T extends any>(componentId, Component: T, options: IFieldWrapperOptions = {}) {
    const NewComponent = (props: IFieldWrapperInputProps): T | any => {
        // Get UI props and create Field Class dynamically (for add field props - input, error, model, ...)
        const metaProps = useComponents().ui.getFieldProps(componentId, props.model, props.attribute);
        const DynamicField = createDynamicField(componentId, Component);

        // Resolve layout
        const context = useContext(FormContext);
        const layout = useMemo(() => mergeLayoutProp(context.layout, props.layout), [context.layout, props.layout]);

        if (layout) {
            return (
                <FieldLayout
                    {...layout}
                    required={_has(props, 'required') ? props.required : metaProps.required}
                    label={options.label === false ? null : (_has(props, 'label') ? props.label : metaProps.label)}
                    hint={_has(props, 'hint') ? props.hint : metaProps.hint}
                    error={props.error}
                >
                    <DynamicField {...props} />
                </FieldLayout>
            );
        }

        return (
            <DynamicField {...props} />
        );
    };

    NewComponent.WrappedComponent = Component;
    return NewComponent;
}
