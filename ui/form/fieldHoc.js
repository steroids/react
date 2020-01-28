import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Field, FieldArray, formValueSelector, getFormSubmitErrors, change} from 'redux-form';
import _get from 'lodash-es/get';
import _upperFirst from 'lodash-es/upperFirst';

import {components} from '../../hoc';
import FieldLayout from './FieldLayout';
import {getFieldProps} from '../../reducers/fields';

const defaultConfig = {
    componentId: '',
    attributes: [''],
    layoutProps: null,
    list: false,
};
const valueSelectors = {};
const errorSelectors = {};

let ID_COUNTER = 1;
const generateUniqueId = () => {
    return 'field' + ID_COUNTER++;
};
const getAttribute = (props, attribute) => {
    return attribute ? props['attribute' + _upperFirst(attribute)] : props.attribute;
};
const getName = (props, attribute) => {
    return [props.prefix, getAttribute(props, attribute)].filter(Boolean).join('.');
};
const getFieldId = (props) => {
    return props.formId + '_' + getName(props, props._config.attributes[0]);
};

@connect(
    (state, props) => {
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
        props._config.attributes.map(attribute => {
            values['value' + _upperFirst(attribute)] = valueSelector(state, getName(props, attribute));
        });

        // Lazy create error selector
        if (!errorSelectors[props.formId]) {
            errorSelectors[props.formId] = getFormSubmitErrors(props.formId);
        }
        const errorSelector = errorSelectors[props.formId];

        return {
            ...values,
            formErrors: errorSelector(state),
            fieldProps: getFieldProps(state, getFieldId(props)),
        };
    }
)
@components('ui')
class FieldHoc extends React.PureComponent {

    static propTypes = {
        attribute: PropTypes.string,
        fieldProps: PropTypes.object,
        formErrors: PropTypes.object,
    };

    constructor() {
        super(...arguments);

        // Check attributes is set
        if (this.props.formId) {
            this.props._config.attributes.forEach(attribute => {
                if (!this.props['attribute' + _upperFirst(attribute)]) {
                    throw new Error(`Please set attribute name "${attribute}" for component "${this.props._wrappedComponent.name}" in form "${this.props.formId}"`);
                }
            });
        }

        if (!this.props.formId) {
            const state = {};
            this.props._config.attributes.forEach(attribute => {
                state['value' + attribute] = _get(this.props, ['input', 'value', attribute].filter(Boolean));
            });
            this.state = state;
            this._fieldId = generateUniqueId();
        } else {
            this._fieldId = getFieldId(this.props);
        }
    }

    render() {
        let {_wrappedComponent, _config, ...props} = this.props;
        const WrappedComponent = _wrappedComponent;

        const inputProps = {};
        if (!_config.list) {
            _config.attributes.forEach(attribute => {
                inputProps[`input${_upperFirst(attribute)}`] = {
                    name: getName(props, attribute),
                    value: this._getValue(attribute),
                    onChange: value => this._setValue(attribute, value),
                };
            });
        }

        // Append custom field props from redux state and UiComponent
        props = {
            ...this.props.ui.getFieldProps(_config.componentId),
            ...props.fieldProps,
            ...props,
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
                {..._config.layoutProps}
                errors={isInvalid ? errors : null}
                isInvalid={isInvalid}
            >
                {!_config.list && props.formId && _config.attributes.map(attribute => (
                    <Field
                        key={props.formId + attribute}
                        name={getName(props, attribute)}
                        component='input'
                        type='hidden'
                    />
                ))}
                {_config.list && (
                    <FieldArray
                        {...props}
                        name={getName(props, '')}
                        component={WrappedComponent}
                        formId={props.formId}
                        fieldId={this._fieldId}
                    />
                ) ||
                (
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
            this.props.dispatch(change(this.props.formId, getName(this.props, attribute), value));
        } else {
            this.setState({
                ['value' + attribute]: value,
            });
        }
    }
}

export default config => WrappedComponent => class FieldHocWrapper extends React.PureComponent {

    static WrappedComponent = WrappedComponent;

    /**
     * Proxy real name, prop types and default props for storybook
     */
    static displayName = WrappedComponent.displayName || WrappedComponent.name;
    static propTypes = WrappedComponent.propTypes;
    static defaultProps = WrappedComponent.defaultProps;

    static contextTypes = {
        formId: PropTypes.string,
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
            PropTypes.object,
        ]),
        prefix: PropTypes.string,
        layout: PropTypes.oneOfType([
            PropTypes.oneOf(['default', 'inline', 'horizontal']),
            PropTypes.string,
            PropTypes.bool,
        ]),
        layoutProps: PropTypes.object,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
    };

    render() {
        return (
            <FieldHoc
                {...this.props}
                formId={this.props.formId || this.context.formId}
                model={this.props.model || this.context.model}
                prefix={this.props.prefix || this.context.prefix}
                layout={this.props.layout || this.props.layout === false ? this.props.layout : this.context.layout}
                layoutProps={{
                    ...this.context.layoutProps,
                    ...this.props.layoutProps,
                }}
                size={this.props.size || this.context.size || 'md'}
                _wrappedComponent={WrappedComponent}
                _config={{
                    ...defaultConfig,
                    componentId: 'form.' + (WrappedComponent.displayName || WrappedComponent.name),
                    ...config,
                }}
            />
        );
    }

};
