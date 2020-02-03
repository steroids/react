import * as React from 'react';
import {findDOMNode} from 'react-dom';
import {connect} from 'react-redux';
import {
    reduxForm,
    getFormValues,
    isInvalid,
    initialize,
    destroy
} from 'redux-form';
import _isEqual from 'lodash-es/isEqual';
import _isString from 'lodash-es/isString';
import _isArray from 'lodash-es/isArray';
import _get from 'lodash-es/get';
import * as queryString from 'query-string';
import {components} from '../../../hoc';
import AutoSaveHelper from './AutoSaveHelper';
import SyncAddressBarHelper from './SyncAddressBarHelper';
import Field from '../Field';
import Button from '../Button';
import formSubmitHoc from '../formSubmitHoc';

export interface IFormContext {
    /*
        formId: PropTypes.string,
        prefix: PropTypes.string,
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
            PropTypes.object
        ]),
        layout: PropTypes.oneOfType([
            PropTypes.oneOf(['default', 'inline', 'horizontal']),
            PropTypes.string,
            PropTypes.bool
        ]),
        layoutProps: PropTypes.object,
        size: PropTypes.oneOf(['sm', 'md', 'lg'])
     */
    formId?: string;
    model?: any;
    prefix?: string | boolean;
    layout?: any;
    layoutProps?: any;
    size?: 'sm' | 'md' | 'lg';
}

export const FormContext = React.createContext<IFormContext>({
    size: 'md',
});

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

interface IFormProps {
    formId: string;
    prefix?: string;
    model?: string | ((...args: any[]) => any) | any;
    action?: string;
    actionMethod?: string;
    layout?: ('default' | 'inline' | 'horizontal') | string | boolean;
    layoutProps?: any;
    size?: 'sm' | 'md' | 'lg';
    onSubmit?: (...args: any[]) => any;
    validators?: any[];
    onBeforeSubmit?: (...args: any[]) => any;
    onAfterSubmit?: (...args: any[]) => any;
    onChange?: (...args: any[]) => any;
    onComplete?: (...args: any[]) => any;
    autoSave?: boolean;
    initialValues?: any | any[];
    className?: string;
    view?: any;
    formValues?: any | any[];
    isInvalid?: boolean;
    formRegisteredFields?: any;
    fields?: (
        | string
        | {
        label?: string,
        hint?: string,
        required?: boolean,
        component?: string | ((...args: any[]) => any)
    }
        )[];
    submitLabel?: string;
    syncWithAddressBar?: boolean;
    restoreCustomizer?: (...args: any[]) => any;
    useHash?: boolean;
    autoFocus?: boolean;
    locationSearch?: string;
    map?: any;
    handleSubmit?: any;
    getView?: any;
    ui?: any;
    store?: any;
    clientStorage?: any;
    dispatch?: any;
}

@connect((state, props) => {
    valuesSelector = getFormValues(props.formId);
    invalidSelector = isInvalid(props.formId);
    return {
        form: props.formId,
        formValues: valuesSelector(state),
        isInvalid: invalidSelector(state),
        formRegisteredFields: _get(state, `form.${props.formId}.registeredFields`),
        locationSearch: _get(state, 'router.location.search', "")
    };
})
@formSubmitHoc()
@reduxForm()
@components('ui', 'store', 'clientStorage')
export default class Form extends React.PureComponent<IFormProps, {}> {

    componentDidMount() {
        // Restore values from query, when autoSave flag is set
        if (this.props.autoSave) {
            const values = AutoSaveHelper.restore(
                this.props.clientStorage,
                this.props.formId,
                this.props.initialValues
            );
            if (values) {
                this.props.dispatch(initialize(this.props.formId, values));
            }
        }
        // Restore values from address bar
        if (this.props.syncWithAddressBar) {
            const query = Object.assign(
                this.props.initialValues || {},
                filterValues(queryString.parse(this.props.locationSearch))
            );
            SyncAddressBarHelper.restore(
                this.props.store,
                this.props.formId,
                query,
                true,
                this.props.restoreCustomizer
            );
        }
        if (this.props.autoFocus) {
            const inputEl = findDOMNode(this).querySelector(
                'input:not([type=hidden])'
            );
            setTimeout(() => {
                if (inputEl && inputEl.focus) {
                    inputEl.focus();
                }
            }, 10);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // Check update values for trigger event
        if (
            (this.props.onChange ||
                this.props.autoSave ||
                this.props.syncWithAddressBar) &&
            !_isEqual(this.props.formValues, nextProps.formValues)
        ) {
            if (this.props.onChange) {
                this.props.onChange(nextProps.formValues);
            }
            if (this.props.autoSave && nextProps.formValues) {
                AutoSaveHelper.save(
                    this.props.clientStorage,
                    this.props.formId,
                    nextProps.formValues
                );
            }
            if (this.props.syncWithAddressBar) {
                const page = Number(_get(nextProps.formValues, 'page', 1));
                const values = {
                    ...nextProps.formValues,
                    page: page > 1 && page
                };
                SyncAddressBarHelper.save(
                    this.props.store,
                    filterValues(values),
                    nextProps.useHash
                );
            }
        }
    }

    render() {
        const FormView = this.props.view || this.props.ui.getView('form.FormView');
        return (
            <FormContext.Provider
                value={{
                    formId: this.props.formId,
                    model: this.props.model,
                    prefix: this.props.prefix,
                    layout: this.props.layout,
                    layoutProps: this.props.layoutProps,
                    size: this.props.size,
                }}
            >
                <FormView
                    {...this.props}
                    onSubmit={this.props.handleSubmit(this.props.onSubmit)}
                >
                    {this.props.children}
                    {this.props.fields &&
                    this.props.fields.map((field: any, index) => (
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
            </FormContext.Provider>
        );
    }
}
