declare module '*.json' {
    const value: any;
    export default value;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

/**
 * Метод для локализации фраз и предложений
 * @example {__('{count} {count, plural, one{день} few{дня} other{дней}}', {count: 2})}
 * @param {string} phrase
 * @param {object} params
 * @private
 */
declare function __(phrase: string, params?: any): string;

/**
 * Название цвета для Alert и Notification
 */
declare type AlertColorName =
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | 'default'
    | string;

/**
 * Название цвета для Button
 */
declare type ButtonColorName =
    | 'basic'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | string;

/**
 * Название цвета для Badge
 */
declare type BadgeColorName =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | string;

/**
 * Название цвета для Text, Title
 */
declare type TypographyColorName =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'text-color'
    | string;

/**
 * Уникальный ключ. ID, UUID или другое
 */
declare type PrimaryKey = number | string;

/**
 * Размер элемента
 */
declare type Size = 'small' | 'middle' | 'large' | string;

/**
 * Ориентация элемента
 */
declare type Orientation = 'horizontal' | 'vertical' | string;

/**
 * Объект из свойства `input` от redux-form
 */
declare type FormInputType = {
    name?: string,
    value?: any,
    onChange?: (...args: any[]) => any,
};

/**
 * Дополнительные CSS классы
 * @example my-block
 */
declare type CssClassName = string;

/**
 * Дополнительные стили
 * @example my-block
 */
declare type CustomStyle = React.CSSProperties;

/**
 * Переопределение view React компонента для кастомизации отображения
 * @example MyCustomView
 */
declare type CustomView = React.ReactNode | ((props: React.ComponentProps<any>) => JSX.Element);

/**
 * Свойства для view компонента
 */
declare type CustomViewProps = React.ComponentProps<any>;

/**
 * Кастомная иконка
 * @example custom-icon
 */
declare type CustomIcon = string | React.ReactElement;

/**
 * HTTP метод
 */
declare type HttpMethod = 'get' | 'post' | 'put' | 'delete' | string;

declare interface IUiComponent {
    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName,

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: CustomStyle,
}

/**
 * Тип данных для параметров маршрута.
 */
declare type RouteParams = Record<string, any> | null;
