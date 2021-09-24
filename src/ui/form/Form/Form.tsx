import * as React from 'react';
import {useSelector} from 'react-redux';
import _get from 'lodash-es/get';
import _isUndefined from 'lodash-es/isUndefined';
import _set from 'lodash-es/set';
import * as queryString from 'qs';
import {useCallback, useEffect, useMemo} from 'react';
import {useFirstMountState, useMount, usePrevious, useUpdateEffect} from 'react-use';
import {IApiMethod} from '../../../components/ApiComponent';
import AutoSaveHelper from './AutoSaveHelper';
import SyncAddressBarHelper from './SyncAddressBarHelper';
import {IFieldProps} from '../Field/Field';
import {useComponents} from '../../../hooks';
import {cleanEmptyObject, normalizeLayout, providers} from '../../../utils/form';
import validate from '../validate';

/**
 * Form
 * Компонент для создания формы
 */
export interface IFormProps {
    /**
     * Идентификатор формы
     * @example BookingForm
     */
    formId?: string;

    prefix?: string;

    /**
     * Модель с полями формы
     * @example {attributes: [{attribute: 'category', field: 'DropDownField'}]}
     */
    model?: string | ((...args: any[]) => any) | any;

    /**
     * Url на который будет отправлена форма
     * @example api/v1/handle-form
     */
    action?: string | IApiMethod;

    /**
     * Тип HTTP запроса (GET | POST | PUT | DELETE)
     * @example POST
     */
    actionMethod?: string;

    /**
     * Шаблон для полей в форме
     * @example horizontal
     */
    layout?: FormLayout;

    /**
     * Обработчик события отправки формы
     * @param args
     */
    onSubmit?: (...args: any[]) => any;

    /**
     * Набор с правилами для проверки соответствия значений полей формы определенному формату.
     * Проверка запускается в момент отправки формы (в обработчике onSubmit).
     * @example [['name', 'required'], ['age', 'integer']]
     */
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

    /**
     * Сохраняет значения полей формы в LocalStorage
     * @example true
     */
    autoSave?: boolean,

    /**
     * Начальные значения формы
     */
    initialValues?: any | any[];

    /**
     * Дополнительный CSS-класс для \<form\>...\<\/form\>
     */
    className?: CssClassName;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    /**
     * @example {className: 'foo'}
     */
    viewProps?: any;

    /**
     * Поля, которые необходимо поместить в форму
     * @example [{attribute: 'category', component: 'DropDownField'}]
     */
    fields?: (string | IFieldProps)[],

    /**
     * Использовать для данных глобальное хранилище (redux)
     * @example true
     */
    useRedux?: boolean,

    /**
     * Надпись на кнопке отправки формы
     * @example Submit
     */
    submitLabel?: string;

    /**
     * Значения полей формы будут подставляться в качестве query-параметров в адресную строку
     * @example true
     */
    syncWithAddressBar?: boolean;

    /**
     * Обработчик, который используется для форматирования значений из адресной строки в валидные значения формы
     */
    restoreCustomizer?: (...args: any[]) => any; // TODO Refactor it!

    /**
     * Указывает, что в качестве сепаратора для параметров формы в адресной строке нужно использовать '#', а не '?'
     */
    useHash?: boolean; // TODO Refactor it!

    /**
     * Если в форме есть элементы \<input\>, то произойдет автоматическая фокусировка на первом из них
     * @example true
     */
    autoFocus?: boolean;

    /**
     * Название действия, которое передаётся в API Google reCAPTCHA v3, для более детального анализа
     * поведения пользователя (https://developers.google.com/recaptcha/docs/v3)
     * @example 'addComment'
     */
    captchaActionName?: string;

    [key: string]: any;
}

export interface IFormViewProps {
    submitLabel?: string;
    fields?: (string | IFieldProps)[],
    onSubmit: any,
    className?: CssClassName,
    style?: any,
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
    reducer?: { dispatch: React.Dispatch<any>, select: any },
    dispatch?: any,
}

export const FormContext = React.createContext<IFormContext>({});

interface ICaptchaParams {
    googleCaptcha: Record<string, any>,
    siteKey: string
    actionName: string
}

const getCaptchaToken = (params:ICaptchaParams):Promise<string> => {
    const {googleCaptcha, siteKey, actionName = 'submit'} = params;

    return new Promise(resolve => {
        googleCaptcha.ready(() => {
            googleCaptcha.execute(siteKey, {action: actionName}).then(token => resolve(token));
        });
    });
};

function Form(props: IFormProps): JSX.Element {
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
    const {
        values,
        submitCounter,
        isInvalid,
        isSubmitting,
        setErrors,
        reducer,
        dispatch,
    } = provider.useForm(props.formId, initialValues);

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
    const onSubmit = useCallback(async (e = null) => {
        // TODO
        if (e) {
            e.preventDefault();
        }

        // Append non touched fields to values object
        if (props.formId) {
            Object.keys(components.ui.getRegisteredFields(props.formId) || {})
                .forEach(key => {
                    if (_isUndefined(_get(values, key))) {
                        _set(values, key, null);
                    }
                });
        }

        let cleanedValues = cleanEmptyObject(values);

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

        // Add captcha token
        let captchaAttribute = null;
        Object.entries(components.ui.getRegisteredFields(props.formId) || {}).forEach(([attribute, fieldType]) => {
            if (fieldType === 'ReCaptchaField') {
                captchaAttribute = attribute;
            }
        });

        if (captchaAttribute && components.resource.googleCaptchaSiteKey) {
            const googleCaptcha = await components.resource.loadGoogleCaptcha();
            const captchaToken = await getCaptchaToken({
                googleCaptcha,
                siteKey: components.resource.googleCaptchaSiteKey,
                actionName: props.captchaActionName,
            });

            cleanedValues = {
                ...cleanedValues,
                [captchaAttribute]: captchaToken,
            };
        }

        // Send request
        const options = {
            onTwoFactor: props.onTwoFactor
                ? async (providerName) => {
                    const info = props.autoStartTwoFactor
                        ? await components.http.post(`/api/v1/auth/2fa/${providerName}/send`)
                        : null;
                    props.onTwoFactor(providerName, info);
                }
                : undefined,
        };
        const response = typeof props.action === 'function'
            ? await props.action.call(null, components.api, cleanedValues, options)
            : await components.http.send(
                props.actionMethod,
                props.action || window.location.pathname,
                cleanedValues,
                options,
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
            setErrors(data.errors);
            return null;
        }
        if (props.onComplete) {
            props.onComplete.call(null, cleanedValues, data, response);
        }
        if (props.autoSave) {
            // TODO
            //const AutoSaveHelper = require('../ui/form/Form/AutoSaveHelper').default;
            //AutoSaveHelper.remove(props.clientStorage, props.formId);
        }

        return null;
    }, [components.api, components.http, components.resource, components.ui, props, setErrors, values]);

    // Manual submit form by reducer action
    const prevSubmitCounter = usePrevious(submitCounter);
    useUpdateEffect(() => {
        if (submitCounter !== prevSubmitCounter) {
            onSubmit.call(null);
        }
    }, [prevSubmitCounter, submitCounter, onSubmit]);

    const formContextValue = useMemo(() => ({
        formId: props.formId,
        model: props.model,
        prefix: props.prefix,
        layout: props.layout,
        provider,
        reducer,
        dispatch,
    }), [dispatch, props.formId, props.layout, props.model, props.prefix, provider, reducer]);

    // Wait initialization (only for redux)
    if (values === undefined) {
        return null;
    }

    // Render context and form
    return (
        <FormContext.Provider value={formContextValue}>
            {props.view !== false
                ? components.ui.renderView(props.view || 'form.FormView', {
                    ...props.viewProps,
                    isInvalid,
                    isSubmitting,
                    layout,
                    onSubmit,
                    children: props.children,
                    submitLabel: props.submitLabel,
                    fields: props.fields,
                    className: props.className,
                })
                : props.children}
        </FormContext.Provider>
    );
}

Form.defaultProps = {
    actionMethod: 'POST',
    autoStartTwoFactor: true,
    layout: 'default',
    captchaActionName: 'submit',
};

export default Form;
