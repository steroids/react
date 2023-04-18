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
 * @example {__('{count} {count, plural, one{день} few{дня} many{дней}}', {count: 2})}
 * @param {string} phrase
 * @param {object} params
 * @private
 */
declare function __(phrase: string, params?: any): string;

/**
 * Название цвета, соответствующее ему состоянию
 */
declare type ColorName =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'light'
    | 'dark'
    | 'basic'
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
declare type CustomView = React.ReactNode | React.FunctionComponent | any;

/**
 * Кастомная иконка
 * @example custom-icon
 */
declare type CustomIcon = string | React.ReactElement;

/**
 * HTTP метод
 */
declare type HttpMethod = 'get' | 'post' | 'put' | 'delete' | string;
