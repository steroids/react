import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * ReCaptchaField
 * Компонент для использования ReCAPTCHA v3 от Google: https://developers.google.com/recaptcha/docs/v3.
 * Чтобы добавить ReCAPTCHA в форму необходимо:
 * 1) Передать siteKey в ResourceComponent.
 * 2) Поместить на сайт скрипт от Google с помощью метода экземпляра ResourceComponent
 * (скрипт анализирует поведение пользователя).
 * 3) Разместить ReCaptchaField внутри компонента Form. На событие формы onSubmit отправится запрос в Google для
 * получения токена. Далее этот токен с остальными данными формы отправится на бэкенд.
 * Сам компонент отображает ссылки на политику конфиденциальности и условия использования сервисов Google.
 */
export interface IReCaptchaFieldProps extends IFieldWrapperInputProps, IUiComponent {

    [key: string]: any;
}

export interface IReCaptchaFieldViewProps extends IReCaptchaFieldProps, IFieldWrapperOutputProps {}

function ReCaptchaField(props: IReCaptchaFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    return components.ui.renderView(props.view || 'form.ReCaptchaFieldView', {
        ...props,
    });
}

export default fieldWrapper<IReCaptchaFieldProps>('ReCaptchaField', ReCaptchaField);
