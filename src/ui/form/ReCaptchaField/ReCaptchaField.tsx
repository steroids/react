import { useComponents } from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * ReCaptchaField
 * Компонент для использования ReCAPTCHA v3 от Google: https://developers.google.com/recaptcha/docs/v3
 * Чтобы добавить ReCAPTCHA в форму необходимо:
 * 1) Передать siteKey в ResourceComponent.
 * 2) В начале работы приложения вызвать метод экземпляра ResourceComponent для загрузки скрипта от Google
 * (скрипт анализирует поведение пользователя).
 * 3) Разместить ReCaptchaField внутри компонента Form. На onSubmit в Google отправится запрос для получения
 * токена. Далее этот токен с остальными данными формы отправится на бэкенд.
 * Сам компонент отображает ссылки на политику конфиденциальности и условия использования сервисов Google.
 */
export interface IReCaptchaFieldProps extends IFieldWrapperInputProps {
    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    [key: string]: any;
}

export interface IReCaptchaFieldViewProps extends IReCaptchaFieldProps, IFieldWrapperOutputProps {}

function ReCaptchaField(props: IReCaptchaFieldProps & IFieldWrapperOutputProps) {
    const components = useComponents();

    return components.ui.renderView(props.view || 'form.ReCaptchaFieldView', {
        ...props,
    });
}

export default fieldWrapper('ReCaptchaField', ReCaptchaField);
