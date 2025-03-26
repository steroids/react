/* eslint-disable react/prop-types */
import React, {useCallback, useMemo} from 'react';
import _get from 'lodash-es/get';
import _isUndefined from 'lodash-es/isUndefined';
import _set from 'lodash-es/set';
import _cloneDeep from 'lodash-es/cloneDeep';
import {useFirstMountState, usePrevious, useUnmount, useUpdateEffect} from 'react-use';
import {IButtonProps} from '@steroidsjs/core/ui/form/Button/Button';
import {showNotification} from '../../../actions/notifications';
import useAddressBar, {IAddressBarConfig} from '../../../hooks/useAddressBar';
import AutoSaveHelper from './AutoSaveHelper';
import {IFieldProps} from '../Field/Field';
import {useComponents, useDispatch} from '../../../hooks';
import {cleanEmptyObject, clearErrors, providers} from '../../../utils/form';
import validate from '../validate';
import {formDestroy, formSetSubmitting} from '../../../actions/form';
import {FieldEnum} from '../../../enums';

/**
 * Form
 *
 * Компонент для создания формы. Предоставляет управление и синхронизацию состояния формы,
 * а также позволяет выполнять отправку данных формы на сервер с возможностью валидации и обработки результатов.
 */
export interface IFormProps extends IUiComponent {
    /**
     * Идентификатор формы
     * @example BookingForm
     */
    formId?: string,

    /**
    * Префикс
    */
    prefix?: string,

    /**
     * Модель с полями формы
     * @example
     * {
     *  attributes: [
     *   {
     *    attribute: 'category',
     *    field: 'DropDownField'
     *   }
     *  ]
     * }
     */
    model?: string | ((...args: any[]) => any) | any,

    /**
     * Url на который будет отправлена форма
     * @example api/v1/handle-form
     */
    action?: string,

    /**
     * Тип HTTP запроса (GET | POST | PUT | DELETE)
     * @example POST
     */
    actionMethod?: string,

    /**
     * Текст ошибки при неудачной отправке данных. По-умолчанию: "Ошибка сервера"
     * @example Упс, что-то пошло не так
     */
    submitErrorMessage?: string,

    /**
     * Обработчик события отправки формы
     * @param args
     */
    onSubmit?: (...args: any[]) => any,

    /**
     * Набор с правилами для проверки соответствия значений полей формы определенному формату.
     * Проверка запускается в момент отправки формы (в обработчике onSubmit).
     * @example
     * [
     *  ['name', 'required'],
     *  ['age', 'integer']
     * ]
     */
    validators?: string[] | Array<string[]> | Array<Record<string, any>>,

    /**
     * Обработчик события перед отправкой формы
     * @param args
     */
    onBeforeSubmit?: (...args: any[]) => any,

    /**
     * Обработчик события после отправки формы
     * @param args
     */
    onAfterSubmit?: (...args: any[]) => any,

    /**
     * Обработчик события при каком-либо изменении в форме
     * @param args
     */
    onChange?: (...args: any[]) => any,

    /**
     * Обработчик события ошибки выполнения запроса
     * @param args
     */
    onError?: (...args: any[]) => any,

    /**
     * Обработчик успешного выполнения формы (без ошибок)
     * @param args
     */
    onComplete?: (...args: any[]) => any,

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
    initialValues?: any | any[],

    /**
     * Свойства для представления
     * @example {className: 'foo'}
     */
    viewProps?: any,

    /**
     * Поля, которые необходимо поместить в форму
     * @example
     * [
     *  {
     *   attribute: 'category',
     *   component: 'DropDownField'
     *  }
     * ]
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
    submitLabel?: string,

    /**
     * Параметры для кнопки отправки формы
     * @example {
     *     block: true,
     * }
     */
    submitButtonProps?: IButtonProps,

    /**
     * Синхронизация значений формы с адресной строкой
     * @example true
     */
    addressBar?: boolean | IAddressBarConfig,

    /**
     * Если в форме есть элементы '<input>', то произойдет автоматическая фокусировка на первом из них
     * @example true
     */
    autoFocus?: boolean,

    /**
     * Название действия, которое передаётся в API Google reCAPTCHA v3, для более детального анализа
     * поведения пользователя (https://developers.google.com/recaptcha/docs/v3)
     * @example 'addComment'
     */
    captchaActionName?: string,

    /**
     * Очищать ли данные формы с redux хранилища при размонтировании компонента. По-умолчанию - false
     * @example false
     */
    autoDestroy?: boolean,

    /**
     * Дополнительные кнопки
     */
    buttons?: React.ReactNode,

    /**
     * Размер компонента и вложенных полей
     */
    size?: Size,

    /**
     * Очищать сообщение об ошибке при редактировании поля. По-умолчанию включено
     */
    useClearErrors?: boolean,

    [key: string]: any,
}

export interface IFormViewProps {
    submitLabel?: string,
    fields?: (string | IFieldProps)[],
    onSubmit: any,
    className?: CssClassName,
    autoFocus?: boolean,
    style?: CustomStyle,
    children?: React.ReactNode,
    buttons?: React.ReactNode,
    submitButtonProps?: IButtonProps,
    size?: Size,
}

export interface IFormReducerState {
    values: any,
    initialValues: any,
    errors: any,
    isInvalid: boolean,
    isSubmitting: boolean,
}

export interface IFormContext {
    /**
    * Id формы
    * @example {}
    */
    formId?: string,

    /**
    * Модель с полями формы
    */
    model?: any,

    /**
    * Префикс для полей формы
    */
    prefix?: string | boolean,

    /**
    * Размер компонента и вложенных полей
    */
    size?: Size,

    /**
    * Провайдер
    */
    provider?: typeof providers.redux | typeof providers.reducer,

    /**
    * Редьюсер
    */
    reducer?: { dispatch: React.Dispatch<any>, select: any, },

    /**
    * Диспатч
    */
    dispatch?: React.Dispatch<any>,
}

export const FormContext = React.createContext<IFormContext>({});

interface ICaptchaParams {
    googleCaptcha: Record<string, any>,
    siteKey: string,
    actionName: string,
}

const getCaptchaToken = (params: ICaptchaParams): Promise<string> => {
    const {googleCaptcha, siteKey, actionName = 'submit'} = params;

    return new Promise(resolve => {
        googleCaptcha.ready(() => {
            googleCaptcha.execute(siteKey, {action: actionName}).then(token => resolve(token));
        });
    });
};

const normalizeInitialQuery = (initialQuery: Record<string, any>) => Object.keys(initialQuery).reduce((acc, key) => {
    const valueInNumberFormat = Number(initialQuery[key]);
    acc[key] = Number.isNaN(valueInNumberFormat) ? initialQuery[key] : Number(initialQuery[key]);
    return acc;
}, {});

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
    const reduxDispatch = useDispatch();

    // Address bar synchronization
    const {
        initialQuery,
        updateQuery,
    } = useAddressBar({
        enable: !!props.addressBar,
        model: props.model,
        ...(typeof props.addressBar === 'boolean' ? {enable: props.addressBar} : props.addressBar),
    });

    // Resolve initial values
    let initialValues = props.initialValues;

    // Restore initial values from address bar and local storage
    const isFirstMount = useFirstMountState();
    if (isFirstMount) {
        // Query
        if (initialQuery) {
            initialValues = {
                ...normalizeInitialQuery(initialQuery),
                ...props.initialValues,
            };
        }

        // Local storage
        if (props.autoSave) {
            initialValues = AutoSaveHelper.restore(components.clientStorage, props.formId, initialValues);
        }
    }

    // Init data provider
    const provider = props.useRedux ? providers.redux : providers.reducer;
    const {
        values,
        submitCounter,
        isSubmitting,
        errors,
        setErrors,
        reducer,
        dispatch,
    } = provider.useForm(props.formId, initialValues);

    // Sync with address bar
    useUpdateEffect(() => {
        updateQuery(values);
    }, [updateQuery, values]);

    // Auto save
    useUpdateEffect(() => {
        if (props.autoSave && values) {
            AutoSaveHelper.save(components.clientStorage, props.formId, values);
        }
    }, [components.clientStorage, props.autoSave, props.formId, values]);

    // Auto destroy
    useUnmount(() => {
        if (props.autoDestroy) {
            dispatch(formDestroy(props.formId));
        }
    });

    // Clear Errors
    const prevValues = usePrevious(values);
    useUpdateEffect(() => {
        if (props.useClearErrors) {
            clearErrors(values, prevValues, errors, setErrors);
        }
    },
    [props.useClearErrors, errors, prevValues, setErrors, values]);

    // OnChange handler
    useUpdateEffect(() => {
        if (props.onChange) {
            props.onChange.call(null, values);
        }
    }, [props.onChange, values]);

    // OnSubmit handler
    const onSubmit = useCallback(async (e = null) => {
        dispatch(formSetSubmitting(props.formId, true));

        if (e) {
            e.preventDefault();
        }
        let cleanedValues = _cloneDeep(values);

        // Append non touched fields to values object
        if (props.formId) {
            Object.keys(components.ui.getRegisteredFields(props.formId) || {})
                .forEach(key => {
                    // Don't set null values for keys in empty array items
                    const keyParts = [];
                    let arrayKey;
                    key.split('.').find(keyPart => {
                        if (keyParts.length > 0 && Array.isArray(_get(cleanedValues, keyParts))) {
                            keyParts.push(keyPart);
                            arrayKey = keyParts.join('.');
                            return true;
                        }
                        keyParts.push(keyPart);
                        return false;
                    });
                    if (arrayKey && !_get(cleanedValues, arrayKey)) {
                        return;
                    }

                    if (_isUndefined(_get(cleanedValues, key))) {
                        _set(cleanedValues, key, null);
                    }
                });
        }

        // Clean
        cleanedValues = cleanEmptyObject(cleanedValues);

        // Event onBeforeSubmit
        if (props.onBeforeSubmit && props.onBeforeSubmit.call(null, cleanedValues) === false) {
            dispatch(formSetSubmitting(props.formId, false));
            return null;
        }
        if (props.validators) {
            validate(cleanedValues, props.validators);
        }
        if (props.onSubmit) {
            const submitResult = await props.onSubmit.call(null, cleanedValues);
            dispatch(formSetSubmitting(props.formId, false));
            return submitResult;
        }

        // Add captcha token
        let captchaAttribute = null;
        Object.entries(components.ui.getRegisteredFields(props.formId) || {}).forEach(([attribute, fieldType]) => {
            if (fieldType === FieldEnum.RE_CAPTCHA) {
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

        // Request options for 2fa
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

        // Send request
        let response;
        try {
            response = await components.http.send(
                props.actionMethod,
                props.action || window.location.pathname,
                cleanedValues,
                options,
            );
        } catch (requestError) {
            console.error(requestError); // eslint-disable-line no-console
            dispatch(formSetSubmitting(props.formId, false));
            if (typeof props.onError === 'function') {
                props.onError(requestError);
            } else {
                reduxDispatch(
                    showNotification(
                        props.submitErrorMessage || __('Ошибка сервера'),
                        'error',
                    ),
                );
            }
            return null;
        }

        // Skip on 2fa
        if (response.twoFactor) {
            dispatch(formSetSubmitting(props.formId, false));
            return null;
        }

        const data = response.data || {};

        // Event onAfterSubmit
        if (props.onAfterSubmit && props.onAfterSubmit.call(null, cleanedValues, data, response) === false) {
            dispatch(formSetSubmitting(props.formId, false));
            return null;
        }

        if (data.errors) {
            dispatch(formSetSubmitting(props.formId, false));
            setErrors(data.errors);
            return null;
        }

        // Clean errors
        setErrors(null);

        if (props.onComplete) {
            props.onComplete.call(null, cleanedValues, data, response);
        }
        if (props.autoSave) {
            AutoSaveHelper.remove(components.clientStorage, props.formId);
        }

        dispatch(formSetSubmitting(props.formId, false));
        return null;
    }, [dispatch, props, values, components.ui, components.resource,
        components.http, components.clientStorage, setErrors, reduxDispatch]);

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
        size: props.size,
        provider,
        reducer,
        dispatch,
    }), [dispatch, props.formId, props.model, props.prefix, props.size, provider, reducer]);

    const viewProps = useMemo(() => ({
        ...props.viewProps,
        isSubmitting,
        onSubmit,
        submitLabel: props.submitLabel,
        submitButtonProps: props.submitButtonProps,
        fields: props.fields,
        children: props.children,
        className: props.className,
        style: props.style,
        autoFocus: props.autoFocus,
        buttons: props.buttons,
        size: props.size,
    }), [isSubmitting, onSubmit, props.autoFocus, props.buttons, props.children, props.className, props.fields,
        props.size, props.style, props.submitButtonProps, props.submitLabel, props.viewProps]);

    // Wait initialization (only for redux)
    if (values === undefined) {
        return null;
    }

    // Render context and form
    return (
        <FormContext.Provider value={formContextValue}>
            {props.view !== false
                ? components.ui.renderView(props.view || 'form.FormView', viewProps)
                : props.children}
        </FormContext.Provider>
    );
}

Form.defaultProps = {
    actionMethod: 'POST',
    autoStartTwoFactor: true,
    captchaActionName: 'submit',
    size: 'md',
    useClearErrors: true,
};

export default Form;
