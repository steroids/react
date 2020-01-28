import React from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {reduxForm, getFormValues, isInvalid, initialize} from 'redux-form';
import _isEqual from 'lodash-es/isEqual';
import _isString from 'lodash-es/isString';
import _isArray from 'lodash-es/isArray';
import _get from 'lodash-es/get';
import queryString from 'query-string';

import {components} from '../../../hoc';
import AutoSaveHelper from './AutoSaveHelper';
import SyncAddressBarHelper from './SyncAddressBarHelper';
import Field from '../Field';
import Button from '../Button';
import formSubmitHoc from '../formSubmitHoc';

let valuesSelector = null;
let invalidSelector = null;
const filterValues = (values = {}) => {
    let obj = {...values};
    Object.keys(obj).forEach(key => {
        if (!obj[key] || (_isArray(obj[key]) && !obj[key].length)) {
            delete obj[key];
        }
    });

    return obj;
};

@connect(
    (state, props) => {
        valuesSelector = getFormValues(props.formId);
        invalidSelector = isInvalid(props.formId);

        return {
            form: props.formId,
            formValues: valuesSelector(state),
            isInvalid: invalidSelector(state),
            formRegisteredFields: _get(state, `form.${props.formId}.registeredFields`),
            locationSearch: _get(state, 'router.location.search', ''),
        };
    }
)
@formSubmitHoc()
@reduxForm()
@components('ui', 'store', 'clientStorage')
export default class Form extends React.PureComponent {

    static propTypes = {
        formId: PropTypes.string.isRequired,
        prefix: PropTypes.string,
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
            PropTypes.object,
        ]),
        action: PropTypes.string,
        actionMethod: PropTypes.string,
        layout: PropTypes.oneOfType([
            PropTypes.oneOf(['default', 'inline', 'horizontal']),
            PropTypes.string,
            PropTypes.bool,
        ]),
        layoutProps: PropTypes.object,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        onSubmit: PropTypes.func,
        validators: PropTypes.array,
        onBeforeSubmit: PropTypes.func,
        onAfterSubmit: PropTypes.func,
        onChange: PropTypes.func,
        onComplete: PropTypes.func,
        autoSave: PropTypes.bool,
        initialValues: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
        ]),
        className: PropTypes.string,
        view: PropTypes.elementType,
        formValues: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
        ]),
        isInvalid: PropTypes.bool,
        formRegisteredFields: PropTypes.object,
        fields: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                label: PropTypes.string,
                hint: PropTypes.string,
                required: PropTypes.bool,
                component: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.func,
                ]),
            })
        ])),
        submitLabel: PropTypes.string,
        syncWithAddressBar: PropTypes.bool,
        restoreCustomizer: PropTypes.func,
        useHash: PropTypes.bool,
        autoFocus: PropTypes.bool,
        locationSearch: PropTypes.string,
    };

    static childContextTypes = {
        formId: PropTypes.string,
        prefix: PropTypes.string,
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
            PropTypes.object,
        ]),
        layout: PropTypes.oneOfType([
            PropTypes.oneOf(['default', 'inline', 'horizontal']),
            PropTypes.string,
            PropTypes.bool,
        ]),
        layoutProps: PropTypes.object,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
    };

    getChildContext() {
        return {
            prefix: this.props.prefix,
            formId: this.props.formId,
            model: this.props.model,
            layout: this.props.layout,
            layoutProps: {
                ...this.props.layoutProps,
            },
            size: this.props.size,
        };
    }

    componentDidMount() {
        // Restore values from query, when autoSave flag is set
        if (this.props.autoSave) {
            const values = AutoSaveHelper.restore(this.props.clientStorage, this.props.formId, this.props.initialValues);
            if (values) {
                this.props.dispatch(initialize(this.props.formId, values));
            }
        }

        // Restore values from address bar
        if (this.props.syncWithAddressBar) {
            const query = Object.assign(
                this.props.initialValues || {},
                filterValues(queryString.parse(this.props.locationSearch)),
            );
            SyncAddressBarHelper.restore(this.props.store, this.props.formId, query, true, this.props.restoreCustomizer);
        }

        if (this.props.autoFocus) {
            const inputEl = findDOMNode(this).querySelector('input:not([type=hidden])');
            setTimeout(() => {
                if (inputEl && inputEl.focus) {
                    inputEl.focus();
                }
            }, 10);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // Check update values for trigger event
        if ((this.props.onChange || this.props.autoSave || this.props.syncWithAddressBar) && !_isEqual(this.props.formValues, nextProps.formValues)) {
            if (this.props.onChange) {
                this.props.onChange(nextProps.formValues);
            }
            if (this.props.autoSave && nextProps.formValues) {
                AutoSaveHelper.save(this.props.clientStorage, this.props.formId, nextProps.formValues);
            }
            if (this.props.syncWithAddressBar) {
                const page = Number(_get(nextProps.formValues, 'page', 1));
                const values = {
                    ...nextProps.formValues,
                    page: page > 1 && page,
                };
                SyncAddressBarHelper.save(this.props.store, filterValues(values), nextProps.useHash);
            }
        }
    }

    render() {
        const FormView = this.props.view || this.props.ui.getView('form.FormView');
        return (
            <FormView
                {...this.props}
                onSubmit={this.props.handleSubmit(this.props.onSubmit)}
            >
                {this.props.children}
                {this.props.fields && this.props.fields.map((field, index) => (
                    <Field
                        key={index}
                        {...(_isString(field) ? {attribute: field} : field)}
                    />
                ))}
                {this.props.submitLabel && (
                    <Button
                        type='submit'
                        label={this.props.submitLabel}
                    />
                )}
            </FormView>
        );
    }

}
