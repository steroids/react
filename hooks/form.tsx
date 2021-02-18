import {useSelector, useDispatch} from 'react-redux';
import _get from 'lodash-es/get';
import _has from 'lodash-es/has';
import _uniqueId from 'lodash-es/uniqueId';

import {
    useCallback, useContext, useMemo, useState,
} from 'react';
import * as React from 'react';
import {useComponents} from './index';
import {FORM_CHANGE, formChange} from '../actions/form';
import {mergeLayoutProp} from '../hoc/form';
import FieldLayout from '../ui/form/FieldLayout';

export interface IFieldHookProps {
    attribute?: string,
    formId?: string,
    prefix?: string | boolean;
    model?: string | ((...args: any[]) => any) | any;
    layout?: FormLayout,

    [key: string]: any,
}

export interface IFieldHookResult {
    formId: string,
    componentId: string,
    error?: any,
    input: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
    },

    [key: string]: any,
}

export interface IFieldWrapperProps {
    formId: string,
    componentId: string,
    error?: any,
    input: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
    },
}

interface IFieldHocOptions {
    label?: boolean,
}

// Data providers
const reduxProvider = (formId, name) => {
    const {value, error} = useSelector(state => ({ // eslint-disable-line react-hooks/rules-of-hooks
        error: _get(state, ['form', formId, 'errors', name].join('.')),
        value: _get(state, ['form', formId, 'values', name].join('.')),
    }));
    const dispatch = useDispatch(); // eslint-disable-line react-hooks/rules-of-hooks
    return {
        error,
        value,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setValue: useCallback(newValue => dispatch(formChange(formId, name, newValue)), [dispatch, formId, name]),
    };
};
const reactReducerProvider = (name) => {
    const [state, dispatch] = useContext(FormReducerContext); // eslint-disable-line react-hooks/rules-of-hooks
    return {
        error: _get(state.errors, name),
        value: _get(state.values, name),
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setValue: useCallback(newValue => dispatch({type: FORM_CHANGE, name, value: newValue}), [dispatch, name]),
    };
};
const reactStateProvider = () => {
    const [value, setValue] = useState(); // eslint-disable-line react-hooks/rules-of-hooks
    return {
        error: null,
        value,
        setValue,
    };
};

export const FormContext = React.createContext<IFormContext>({});
export const FormReducerContext = React.createContext<[IFormReducerState, React.Dispatch<any>]>(null);

function useFormField(componentId: string, props: IFieldHookProps): IFieldHookResult {
    // Get full name (attribute with prefix)
    const name = [props.prefix, props.attribute].filter(Boolean).join('.');

    // Get context, formId
    const context = useContext(FormContext);
    const formId = props.formId || context?.formId || null;
    const model = props.model || context?.model || null;

    // Resolve data provider
    const {error, value, setValue} = formId
        ? (!context.globalState ? reactReducerProvider(name) : reduxProvider(formId, name))
        : reactStateProvider();

    // Input object
    const input = useMemo(() => ({
        name,
        value,
        onChange: setValue,
    }), [name, value, setValue]);

    return {
        ...props,
        ...useComponents().ui.getFieldProps(componentId, model, props.attribute),
        model,
        componentId,
        formId,
        error,
        input,
    };
}

const FieldWrapper = (props) => {
    const components = useComponents();
    const newProps = useFormField(props.componentId, props);

    const Component = newProps.component;
    delete newProps.component;

    return components.ui.renderView(Component, newProps);
};

// Field HOC
export const fieldWrapper = (componentId, options: IFieldHocOptions = {}) => Component => (props: IFieldHookProps) => {
    const context = useContext(FormContext);
    const metaProps = useComponents().ui.getFieldProps(componentId, props.model, props.attribute);
    const layout = useMemo(() => mergeLayoutProp(context.layout, props.layout), [context.layout, props.layout]);
    const content = React.memo((contentProps) => (
        <FieldWrapper {...contentProps} component={Component} componentId={componentId} />
    ));

    if (layout) {
        return (
            <FieldLayout
                {...layout}
                required={_has(props, 'required') ? props.required : metaProps.required}
                label={options.label === false ? null : (_has(props, 'label') ? props.label : metaProps.label)}
                hint={_has(props, 'hint') ? props.hint : metaProps.hint}
                error={props.error}
            >
                {content}
            </FieldLayout>
        );
    }

    return content;
};

export const useFormSelector = (selector: (state) => any) => {
    const context = useContext(FormContext);
    if (context) {
        // Redux
        if (context.globalState) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return useSelector(state => selector(_get(state, ['form', context.formId])));
        }

        // React Reducer
        const [state] = useContext(FormReducerContext); // eslint-disable-line react-hooks/rules-of-hooks
        return selector(state);
    }

    // No form
    return null;
};
