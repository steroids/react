import * as React from 'react';
import {findDOMNode} from 'react-dom';
import {connect} from 'react-redux';
import {reduxForm, getFormValues, isInvalid, initialize} from 'redux-form';
import _isEqual from 'lodash-es/isEqual';
import _isString from 'lodash-es/isString';
import _isArray from 'lodash-es/isArray';
import _get from 'lodash-es/get';
import * as queryString from 'qs';
import components, {IComponentsHocOutput} from '../../../hoc/components';
import formSubmit, {IFormSubmitHocInput, IFormSubmitHocOutput} from '../../../hoc/formSubmit';
import {FormContext} from '../../../hoc/form';
import AutoSaveHelper from './AutoSaveHelper';
import SyncAddressBarHelper from './SyncAddressBarHelper';
import Field from '../Field';
import Button from '../Button';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IFieldProps} from '../Field/Field';
import {theme} from '../../../hoc';
import {IThemeHocInput, IThemeHocOutput} from '../../../hoc/theme';

export interface IFormProps extends IFormSubmitHocInput, IThemeHocInput {
    formId?: string;
    prefix?: string;
    model?: string | ((...args: any[]) => any) | any;

    /**
     * Url на который будет отправлена форма
     * @example api/v1/handle-form
     */
    action?: string;

    /**
     * Тип HTTP запроса (GET | POST | PUT | DELETE)
     * @example POST
     */
    actionMethod?: string;
    layout?: FormLayout;

    /**
     * Обработчик события отправки формы
     * @param args
     */
    onSubmit?: (...args: any[]) => any;
    validators?: any[];

    /**
     * Обработчик события перед отправкой формы
     * @param args
     */
    onBeforeSubmit?: (...args: any[]) => any;

    /**
     * Обработчик события после отправки формы
     * @param args
     */
    onAfterSubmit?: (...args: any[]) => any;

    /**
     * Обработчик события при каком-либо изменении в форме
     * @param args
     */
    onChange?: (...args: any[]) => any;
    onComplete?: (...args: any[]) => any;
    autoSave?: boolean;

    /**
     * Начальные значения формы
     */
    initialValues?: any | any[];
    className?: CssClassName;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;
    view?: CustomView;
    fields?: (string | IFieldProps)[],
    /*fields?: (
        | string
        | {
        label?: string,
        hint?: string,
        required?: boolean,
        component?: string | React.ReactNode
    }
        )[];*/
    /**
     * Надпись на конпке отправки формы
     * @example Submit
     */
    submitLabel?: string;
    syncWithAddressBar?: boolean;
    restoreCustomizer?: (...args: any[]) => any; // TODO Refactor it!
    useHash?: boolean; // TODO Refactor it!
    autoFocus?: boolean;
}

export interface IFormViewProps {
    onSubmit: any,
}

interface IFormPrivateProps extends IFormSubmitHocOutput, IThemeHocOutput, IConnectHocOutput, IComponentsHocOutput {
    formValues?: any | any[];
    locationSearch?: string;
    isInvalid?: boolean;
    formRegisteredFields?: any;
    handleSubmit?: any;
}

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

@connect((state, props) => {
    valuesSelector = getFormValues(props.formId);
    invalidSelector = isInvalid(props.formId);
    return {
        form: props.formId,
        formValues: valuesSelector(state),
        isInvalid: invalidSelector(state),
        formRegisteredFields: _get(state, `form.${props.formId}.registeredFields`),
        locationSearch: _get(state, 'router.location.search', '')
    };
})
@formSubmit()
@reduxForm()
@theme()
@components('ui', 'store', 'clientStorage')
export default class Form extends React.PureComponent<IFormProps & IFormPrivateProps> {

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
        if (this.props.autoFocus && process.env.IS_WEB) {
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
                }}
            >
                <FormView
                    {...this.props}
                    layout={typeof this.props.layout === 'object' ? this.props.layout : {layout: this.props.layout}}
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
                            onClick={this.props.handleSubmit(this.props.onSubmit)}
                            label={this.props.submitLabel}
                        />
                    )}
                </FormView>
            </FormContext.Provider>
        );
    }
}
