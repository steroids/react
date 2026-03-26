/* eslint-disable max-len */
import {useCallback, useMemo} from 'react';

import {FieldEnum} from '../../../enums';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * ReCaptchaField
 * Компонент для использования ReCAPTCHA v3 от Google.
 * Чтобы добавить ReCAPTCHA в форму необходимо:
 * 1) Передать siteKey в ResourceComponent.
 * 2) Поместить на сайт скрипт от Google с помощью метода экземпляра ResourceComponent
 * (скрипт анализирует поведение пользователя).
 * 3) Разместить ReCaptchaField внутри компонента Form. На событие формы onSubmit отправится запрос в Google для
 * получения токена. Далее этот токен с остальными данными формы отправится на бэкенд.
 * Сам компонент отображает ссылки на политику конфиденциальности и условия использования сервисов Google.
 */
export interface IReCaptchaFieldProps extends IFieldWrapperInputProps, IUiComponent {
    /**
     * Обработчик события изменения ReCaptcha.
     */
    onChange?: VoidFunction,

    /**
     * Функция, вызываемая после загрузки асинхронного скрипта.
     */
    asyncScriptOnLoad?: () => void,

    /**
     * Положение значка ReCaptcha. Может быть 'bottomright' (внизу справа), 'bottomleft' (внизу слева) или 'inline' (встроенный).
     */
    badge?: 'bottomright' | 'bottomleft' | 'inline',

    /**
     * Тип ReCaptcha. Может быть 'image' (изображение) или 'audio' (аудио).
     */
    type?: 'image' | 'audio',

    /**
     * Значение tabindex для ReCaptcha.
     */
    tabindex?: number,

    /**
     * Защищенный токен для ReCaptcha.
     */
    stoken?: string,

    /**
     * Обработчик события истечения срока действия ReCaptcha.
     */
    onExpired?: VoidFunction,

    /**
     * Обработчик события ошибки ReCaptcha.
     */
    onErrored?: VoidFunction,

    /**
     * Флаг, указывающий на изоляцию ReCaptcha.
     */
    isolated?: boolean,

    /**
     * Языковой код для ReCaptcha.
     */
    hl?: string,

    /**
     * Ссылка на ref-объект React для ReCaptcha.
     */
    ref?: React.RefObject<any>,

    /**
     * Ключ сайта ReCaptcha. По умолчанию process.env.APP_RECAPTCHA_SITE_KEY
     */
    sitekey?: string,

    /**
     * Дополнительные свойства, которые могут быть указаны.
     */
    [key: string]: any,
}

export interface IReCaptchaFieldViewProps extends IReCaptchaFieldProps, IFieldWrapperOutputProps {
    sitekey: string,

    recaptchaOptions: {
        onChange: VoidFunction,
        asyncScriptOnLoad: () => void,
        badge: 'bottomright' | 'bottomleft' | 'inline',
        type: 'image' | 'audio',
        tabindex: number,
        stoken: string,
        onExpired: VoidFunction,
        onErrored: VoidFunction,
        isolated: boolean,
        hl: string,
        ref: React.RefObject<any>,
    },
}

function ReCaptchaField(props: IReCaptchaFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const onChange = useCallback(() => {
        if (props.onChange) {
            props.onChange();
        }
    }, [props]);

    const recaptchaOptions = useMemo(() => ({
        onChange,
        asyncScriptOnLoad: props.asyncScriptOnLoad,
        badge: props.badge,
        type: props.type,
        tabindex: props.tabindex,
        stoken: props.stoken,
        onExpired: props.onExpired,
        onErrored: props.onErrored,
        isolated: props.isolated,
        hl: props.hl,
        ref: props.ref,
        sitekey: props.sitekey || components.resource.googleCaptchaSiteKey,
    }), [components.resource.googleCaptchaSiteKey, onChange, props.asyncScriptOnLoad, props.badge, props.hl, props.isolated, props.onErrored, props.onExpired, props.ref, props.sitekey, props.stoken, props.tabindex, props.type]);

    const viewProps = useMemo(() => ({
        recaptchaOptions,
        className: props.className,
        style: props.style,
    }), [props.className, props.style, recaptchaOptions]);

    return components.ui.renderView(props.view || 'form.ReCaptchaFieldView', viewProps);
}

export default fieldWrapper<IReCaptchaFieldProps>(FieldEnum.RE_CAPTCHA_FIELD, ReCaptchaField);
