import * as React from 'react';
import {useSelector} from 'react-redux';
import _get from 'lodash-es/get';
import _isUndefined from 'lodash-es/isUndefined';
import _set from 'lodash-es/set';
import * as queryString from 'qs';
import {useCallback, useMemo} from 'react';
import {useFirstMountState, useMount, usePrevious, useUpdateEffect} from 'react-use';
import AutoSaveHelper from './AutoSaveHelper';
import SyncAddressBarHelper from './SyncAddressBarHelper';
import {IFieldProps} from '../Field/Field';
import {useComponents} from '../../../hooks';
import {cleanEmptyObject, normalizeLayout, providers} from '../../../utils/form';
import validate from '../validate';

export interface IFormProps {
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

    /**
     * Обработчик успешного выполнения формы (без ошибок)
     * @param args
     */
    onComplete?: (...args: any[]) => any;

    /**
     * Автоматически стартовать 2fa аутентификацию (отправлять код)
     */
    autoStartTwoFactor?: boolean,

    /**
     * Обработчик, который вызывается при запросе 2FA
     */
    onTwoFactor?: (providerName: string, info?: any) => Promise<any> | any | void,

    autoSave?: boolean,

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

    /**
     * Использовать для данных глобальное хранилище (redux)
     * @example true
     */
    useRedux?: boolean,

    /**
     * Надпись на конпке отправки формы
     * @example Submit
     */
    submitLabel?: string;
    syncWithAddressBar?: boolean;
    restoreCustomizer?: (...args: any[]) => any; // TODO Refactor it!
    useHash?: boolean; // TODO Refactor it!
    autoFocus?: boolean;

    [key: string]: any;
}

export interface IFormViewProps {
    submitLabel?: string;
    fields?: (string | IFieldProps)[],
    onSubmit: any,
    className?: CssClassName,
    layout?: {
        layout: FormLayoutName | boolean,
        className: CssClassName,
        label: boolean,
        cols: number[],
        [key: string]: any,
    },
    children?: React.ReactNode,
}

export interface IFormReducerState {
    values: any,
    initialValues: any,
    errors: any,
    isInvalid: boolean,
    isSubmitting: boolean,
}

export interface IFormContext {
    formId?: string;
    model?: any;
    prefix?: string | boolean;
    layout?: FormLayout;
    provider?: any,
    reducer?: {dispatch: React.Dispatch<any>, select: any},
}

export const FormContext = React.createContext<IFormContext>({});

function Form(props: IFormProps) {
    // Dev validation. You cannot change data provider (formId, useRedux)
    if (process.env.NODE_ENV !== 'production') {
        const prevFormId = usePrevious(props.formId); // eslint-disable-line react-hooks/rules-of-hooks
        const prevUseRedux = usePrevious(props.useRedux); // eslint-disable-line react-hooks/rules-of-hooks
        if ((prevFormId && props.formId !== prevFormId) || (prevUseRedux && props.useRedux !== prevUseRedux)) {
            throw new Error('Props formId and useRedux cannot be changed dynamically! Its related to data provider');
        }
    }

    // Get components and dispatch method
    const components = useComponents();

    // Normalize layout
    const layout = useMemo(() => normalizeLayout(props.layout), [props.layout]);

    // Resolve initial values
    let initialValues = props.initialValues;

    // Restore initial values from address bar and local storage
    const isFirstMount = useFirstMountState();
    const locationSearch = useSelector(state => _get(state, 'router.location.search', ''));
    if (isFirstMount) {
        // Query
        if (props.syncWithAddressBar) {
            initialValues = SyncAddressBarHelper.restore(
                {
                    ...props.initialValues,
                    ...SyncAddressBarHelper.cleanValues(queryString.parse(locationSearch)),
                },
                props.restoreCustomizer,
            );
        }

        // Local storage
        if (props.autoSave) {
            initialValues = AutoSaveHelper.restore(props.clientStorage, props.formId, initialValues);
        }
    }

    // Init data provider
    const provider = props.useRedux ? providers.redux : providers.reducer;
    const {values, isInvalid, isSubmitting, setErrors, reducer} = provider.useForm(props.formId, initialValues);

    // Sync with address bar
    useUpdateEffect(() => {
        if (props.syncWithAddressBar) {
            // TODO
            /*const page = Number(_get(values, 'page', 1));
            SyncAddressBarHelper.save(
                components.store,
                SyncAddressBarHelper.cleanValues({
                    ...values,
                    page: page > 1 && page,
                }),
                props.useHash,
            );*/
        }
    }, [props.syncWithAddressBar, props.useHash, values]);

    // Auto focus
    useMount(() => {
        if (props.autoFocus && process.env.IS_WEB) {
            // TODO
            /*const element: any = findDOMNode(this);
            const inputEl = element.querySelector('input:not([type=hidden])');
            setTimeout(() => {
                if (inputEl && inputEl.focus) {
                    inputEl.focus();
                }
            }, 10);*/
        }
    });

    // Auto save
    useUpdateEffect(() => {
        if (props.autoSave && values) {
            // TODO
            //AutoSaveHelper.save(components.clientStorage, props.formId, values);
        }
    }, [props.autoSave, values]);

    // OnChange handler
    useUpdateEffect(() => {
        if (props.onChange) {
            props.onChange(values);
        }
    }, [props, values]);

    // OnSubmit handler
    const onSubmit = useCallback(async () => {
        // TODO

        // Append non touched fields to values object
        if (props.formId) {
            Object.keys(components.ui.getRegisteredFields(props.formId).formRegisteredFields || {}).forEach(key => {
                const registeredName = this.props.formRegisteredFields[key].name;
                if (_isUndefined(_get(values, registeredName))) {
                    _set(values, registeredName, null);
                }
            });
        }

        const cleanedValues = cleanEmptyObject(values);

        // Event onBeforeSubmit
        if (props.onBeforeSubmit && props.onBeforeSubmit.call(null, cleanedValues) === false) {
            return null;
        }
        if (props.validators) {
            validate(cleanedValues, props.validators);
        }
        if (props.onSubmit) {
            return props.onSubmit.call(null, cleanedValues);
        }

        // Send request
        const response = await this.props.http.send(
            this.props.actionMethod,
            this.props.action || window.location.pathname,
            cleanedValues,
            {
                onTwoFactor: this.props.onTwoFactor
                    ? async (providerName) => {
                        const info = this.props.autoStartTwoFactor
                            ? await this.props.http.post(`/api/v1/auth/2fa/${providerName}/send`)
                            : null;
                        this.props.onTwoFactor(providerName, info);
                    }
                    : undefined,
            },
        );

        // Skip on 2fa
        if (response.twoFactor) {
            return null;
        }

        const data = response.data || {};

        // Event onAfterSubmit
        if (props.onAfterSubmit && props.onAfterSubmit.call(null, cleanedValues, data, response) === false) {
            return null;
        }
        if (data.errors) {
            setErrors(props.formId, data.errors);
            return null;
        }
        if (this.props.onComplete) {
            this.props.onComplete.call(null, cleanedValues, data, response);
        }
        if (this.props.autoSave) {
            // TODO
            //const AutoSaveHelper = require('../ui/form/Form/AutoSaveHelper').default;
            //AutoSaveHelper.remove(this.props.clientStorage, this.props.formId);
        }

        return null;
    }, [components.ui, props.formId, props.onAfterSubmit, props.onBeforeSubmit, props.onSubmit,
        props.validators, setErrors, values]);

    const formContextValue = useMemo(() => ({
        formId: props.formId,
        model: props.model,
        prefix: props.prefix,
        layout: props.layout,
        provider,
        reducer,
    }), [props.formId, props.model, props.prefix, props.layout, provider, reducer]);

    // Render context and form
    const content = useMemo(() => (
        <FormContext.Provider value={formContextValue}>
            {components.ui.renderView(props.view || 'form.FormView', {
                isInvalid,
                isSubmitting,
                layout,
                onSubmit,
                children: props.children,
            })}
        </FormContext.Provider>
    ), [formContextValue, components.ui, props.view, props.children, isInvalid, isSubmitting, layout, onSubmit]);

    // Wrap with reducer provider, if need
    /*if (!props.useRedux) {
        content = (
            <FormReducerContext.Provider value={reducer}>
                {content}
            </FormReducerContext.Provider>
        );
    }*/
    return content;
}

Form.defaultProps = {
    actionMethod: 'POST',
    autoStartTwoFactor: true,
};

export default Form;
