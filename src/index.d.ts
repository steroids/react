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
    'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'light'
    | 'dark'
    | string;

/**
 * Уникальный ключ. ID, UUID или другое
 */
declare type PrimaryKey = number | string;

/**
 * Размер элемента
 */
declare type Size = 'sm' | 'md' | 'lg' | string;

/**
 * Макет формы или ее части, влияющий на расположение полей
 */
declare type FormLayoutName = 'default' | 'horizontal' | 'inline' | string;

/**
 * Свойства для настройки макета формы
 */
declare type FormLayout = FormLayoutName | boolean | {
    layout: FormLayoutName | boolean,
    className?: string,
    label?: boolean,
    cols?: number[],
    [key: string]: any,
};

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
 * Переопределение view React компонента для кастомизациии отображения
 * @example MyCustomView
 */
declare type CustomView = React.ReactNode;

/**
 * HTTP метод
 */
declare type HttpMethod = 'get' | 'post' | 'put' | 'delete' | string;
