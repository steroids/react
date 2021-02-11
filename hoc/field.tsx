import * as React from 'react';
import {Field, FieldArray, formValueSelector, getFormSubmitErrors, change} from 'redux-form';
import _get from 'lodash-es/get';
import _omit from 'lodash-es/omit';
import _upperFirst from 'lodash-es/upperFirst';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';

import {getFieldProps, getModel} from '../reducers/fields';
import connect from './connect';
import components, {IComponentsHocOutput} from './components';
import form, {IFormHocOutput} from './form';

/**
 * Field HOC
 * Обертка над полями форм. Если создаете свой элемент формы - добавьте декоратор с этим HOC.
 */
export interface IFieldHocInput {

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
     * Обязательное ли поле? Если true, то к названию будет добавлен модификатор 'required' - красная звездочка (по умолчанию)
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
}

export interface IFieldHocOutput extends IFormHocOutput {
    input?: FormInputType,
    fieldId?: string,
    isInvalid?: boolean,

    dark?: boolean,
    size?: Size,
}

export interface IFieldHocConfig {
    appendPrefix: boolean,
    componentId: string,
    attributes: string[],
    layout: FormLayout,
    list: boolean,
}

interface IFieldHocPrivateProps extends IComponentsHocOutput {
    formId?: any;
    fieldPropsFromRedux?: any;
    formErrors?: any;
    dispatch?: any;
}

const defaultConfig = {
    appendPrefix: true,
    componentId: '',
    attributes: [''],
    layout: null,
    list: false,
    layoutProps: null,
} as IFieldHocConfig;

const valueSelectors = {};
const errorSelectors = {};
let ID_COUNTER = 1;
const generateUniqueId = () => {
    return 'field' + ID_COUNTER++;
};
const getAttribute = (props, attribute) => {
    return attribute
        ? props['attribute' + _upperFirst(attribute)]
        : props.attribute;
};
const getName = (props, attribute) => {
    return [props.prefix, getAttribute(props, attribute)]
        .filter(Boolean)
        .join('.');
};
const getFieldId = (props, config) => {
    return props.formId + '_' + getName(props, config.attributes[0]);
};
export const getFieldPropsFromModel = (model, attribute) => {
    if (!model || !attribute) {
        return null;
    }
    if (_isFunction(model.fields)) {
        return model.fields()[attribute] || null;
    }
    if (_isObject(model.fields)) {
        return model.fields[attribute] || null;
    }
    return null;
};

export default (customConfig): any => WrappedComponent => {
    const config = {
        ...defaultConfig,
        componentId: 'form.' + (WrappedComponent.displayName || WrappedComponent.name),
        ...customConfig,
    };

    return form({
        appendPrefix: config.appendPrefix,
    })(
        connect(
            (state, props) => {
                if (!props.formId) {
                    return {};
                }

                // Fetch values
                const values = {};
                if (!config.list) {
                    // Lazy create value selector
                    if (!valueSelectors[props.formId]) {
                        valueSelectors[props.formId] = formValueSelector(props.formId);
                    }
                    const valueSelector = valueSelectors[props.formId];

                    config.attributes.map(attribute => {
                        values['value' + _upperFirst(attribute)] = valueSelector(
                            state,
                            getName(props, attribute)
                        );
                    });
                }
                // Lazy create error selector
                if (!errorSelectors[props.formId]) {
                    errorSelectors[props.formId] = getFormSubmitErrors(props.formId);
                }
                const errorSelector = errorSelectors[props.formId];
                const formErrors = errorSelector(state);
                return {
                    ...values,
                    model: getModel(state, props.model),
                    formErrors: Object.keys(formErrors).length > 0 ? formErrors : null,
                    fieldPropsFromRedux: getFieldProps(state, getFieldId(props, config))
                };
            }
        )(
            components('ui')(
                class FieldHoc extends React.Component<IFieldHocInput & IFieldHocPrivateProps> {

                    _fieldId: any;

                    constructor(props) {
                        super(props);
                        // Check attributes is set
                        if (this.props.formId) {
                            config.attributes.forEach(attribute => {
                                if (!this.props['attribute' + _upperFirst(attribute)]) {
                                    throw new Error(
                                        `Please set attribute name '${attribute}' for component '${WrappedComponent.name}' in form '${this.props.formId}'`
                                    );
                                }
                            });
                        }
                        if (!this.props.formId) {
                            const state = {};
                            config.attributes.forEach(attribute => {
                                state['value' + attribute] = _get(
                                    this.props,
                                    ['input', 'value', attribute].filter(Boolean)
                                );
                            });
                            this.state = state;
                            this._fieldId = generateUniqueId();
                        } else {
                            this._fieldId = getFieldId(this.props, config);
                        }
                    }

                    render() {
                        const FieldLayout = require('../ui/form/FieldLayout').default;
                        const outputProps = {
                            ...this.props.ui.getFieldProps(config.componentId, this.props.model, this.props.attribute),
                            ...this.props.fieldPropsFromRedux,
                        } as IFieldHocOutput;

                        const inputProps = {};
                        const valuePropKeys = [];
                        if (!config.list) {
                            config.attributes.forEach(attribute => {
                                valuePropKeys.push('attribute' + _upperFirst(attribute));
                                inputProps[`input${_upperFirst(attribute)}`] = {
                                    name: getName(this.props, attribute),
                                    value: this._getValue(attribute),
                                    onChange: value => this._setValue(attribute, value)
                                };
                            });
                        }

                        // Get errors
                        let errors = this.props.errors;
                        Object.keys(inputProps).map(key => {
                            const name = inputProps[key].name;
                            const error = _get(this.props.formErrors, name);
                            if (error) {
                                errors = (errors || []).concat(error);
                            }
                        });
                        const isInvalid = errors && errors.length > 0;

                        // TODO implement values in state for list (instead of redux-form FieldArray)

                        return (
                            <FieldLayout
                                {...outputProps}
                                {...(typeof config.layout === 'object' ? config.layout : {layout: config.layout})}
                                {...config.layoutProps}
                                errors={isInvalid ? errors : null}
                                isInvalid={isInvalid}
                            >
                                {!config.list && this.props.formId && process.env.IS_WEB && config.attributes.map(attribute => (
                                    <Field
                                        key={this.props.formId + attribute}
                                        name={getName(this.props, attribute)}
                                        component='input'
                                        type='hidden'
                                    />
                                ))}
                                {config.list && (
                                    <FieldArray
                                        {...outputProps}
                                        {...this.props}
                                        name={getName(this.props, '')}
                                        component={WrappedComponent}
                                        formId={this.props.formId}
                                        fieldId={this._fieldId}
                                    />
                                ) || (
                                    <WrappedComponent
                                        {...outputProps}
                                        {...inputProps}
                                        {...this.props}
                                        isInvalid={isInvalid}
                                        formId={this.props.formId}
                                        fieldId={this._fieldId}
                                    />
                                )}
                            </FieldLayout>
                        );
                    }

                    _getValue(attribute) {
                        if (this.props.formId) {
                            return _get(this.props, 'value' + _upperFirst(attribute));
                        } else {
                            return this.state['value' + attribute];
                        }
                    }

                    _setValue(attribute, value) {
                        if (this.props.formId) {
                            this.props.dispatch(
                                change(this.props.formId, getName(this.props, attribute), value)
                            );
                        } else {
                            this.setState({
                                ['value' + attribute]: value
                            });
                        }
                    }

                }
            )
        )
    )
}