import * as React from 'react';
import {connect} from 'react-redux';
import {
    Field,
    FieldArray,
    formValueSelector,
    getFormSubmitErrors,
    change
} from 'redux-form';
import _get from 'lodash-es/get';
import _upperFirst from 'lodash-es/upperFirst';
import {components} from '../../hoc';
import FieldLayout from './FieldLayout';
import {getFieldProps, getMeta} from '../../reducers/fields';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import _isString from 'lodash-es/isString';
import {FormContext} from './Form/Form';
import {IComponentsContext} from '../../hoc/components';
import formIdHoc from './formIdHoc';

const defaultConfig = {
    componentId: "",
    attributes: [""],
    layoutProps: null,
    list: false
};
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

interface IFieldHocProps extends IComponentsContext {
    attribute?: string;
    fieldProps?: any;
    formErrors?: any;
    _wrappedComponent?: any;
    props?: any;
    formId?: any;
    size?: string;
    dispatch?: any;
    errors?: any;
    forEach?: any;
    attributes?: any;
    model?: any;
    layout?: any;
    prefix?: any;
    layoutProps?: any;
}

export default (customConfig): any => WrappedComponent => {
    const config = {
        ...defaultConfig,
        componentId: 'form.' + (WrappedComponent.displayName || WrappedComponent.name),
        ...customConfig,
    };

    return formIdHoc()(
        connect((state, props) => {
            if (!props.formId) {
                return {};
            }

            // Lazy create value selector
            if (!valueSelectors[props.formId]) {
                valueSelectors[props.formId] = formValueSelector(props.formId);
            }
            const valueSelector = valueSelectors[props.formId];
            // Fetch values
            const values = {};
            config.attributes.map(attribute => {
                values['value' + _upperFirst(attribute)] = valueSelector(
                    state,
                    getName(props, attribute)
                );
            });
            // Lazy create error selector
            if (!errorSelectors[props.formId]) {
                errorSelectors[props.formId] = getFormSubmitErrors(props.formId);
            }
            const errorSelector = errorSelectors[props.formId];
            let model = props.model;
            if (_isString(model)) {
                model = getMeta(state, model) || null;
            }
            return {
                ...values,
                model,
                formErrors: errorSelector(state),
                fieldProps: getFieldProps(state, getFieldId(props, config))
            };
        })(
            components('ui')(
                class FieldHoc extends React.PureComponent<IFieldHocProps> {

                    _fieldId: any;

                    constructor(props) {
                        super(props);
                        // Check attributes is set
                        if (this.props.formId) {
                            config.attributes.forEach(attribute => {
                                if (!this.props['attribute' + _upperFirst(attribute)]) {
                                    throw new Error(
                                        `Please set attribute name '${attribute}' for component '${this.props._wrappedComponent.name}' in form '${this.props.formId}'`
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
                        return (
                            <FormContext.Consumer>
                                {context => this.renderContent(context)}
                            </FormContext.Consumer>
                        )
                    }

                    renderContent(context) {
                        let props = {
                            formId: context.formId,
                            model: context.model,
                            prefix: context.prefix,
                            size: context.size || 'md',
                            ...this.props,
                            layout: this.props.layout || this.props.layout === false
                                ? this.props.layout
                                : context.layout,
                            layoutProps: {
                                ...context.layoutProps,
                                ...this.props.layoutProps,
                            }
                        };

                        const inputProps = {};
                        if (!config.list) {
                            config.attributes.forEach(attribute => {
                                inputProps[`input${_upperFirst(attribute)}`] = {
                                    name: getName(props, attribute),
                                    value: this._getValue(attribute),
                                    onChange: value => this._setValue(attribute, value)
                                };
                            });
                        }
                        // Append custom field props from redux state and UiComponent
                        props = {
                            ...this.props.ui.getFieldProps(config.componentId),
                            ...getFieldPropsFromModel(this.props.model, this.props.attribute),
                            ...props.fieldProps,
                            ...props
                        };
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
                                {...props}
                                {...config.layoutProps}
                                errors={isInvalid ? errors : null}
                                isInvalid={isInvalid}
                            >
                                {!config.list &&
                                props.formId &&
                                config.attributes.map(attribute => (
                                    <Field
                                        key={props.formId + attribute}
                                        name={getName(props, attribute)}
                                        component='input'
                                        type='hidden'
                                    />
                                ))}
                                {(config.list && (
                                    <FieldArray
                                        {...props}
                                        name={getName(props, "")}
                                        component={WrappedComponent}
                                        formId={props.formId}
                                        fieldId={this._fieldId}
                                    />
                                )) || (
                                    <WrappedComponent
                                        {...props}
                                        {...inputProps}
                                        isInvalid={isInvalid}
                                        formId={props.formId}
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