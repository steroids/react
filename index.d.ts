declare module '*.json' {
    const value: any;
    export default value;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

declare function __(str: string, params?: any): string;

declare type ColorName = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark' | string;

declare type PrimaryKey = number | string;

declare type Size = 'sm' | 'md' | 'lg' | string;

declare type FormLayoutName = 'default' | 'horizontal' | 'inline' | string;
declare type FormLayout = FormLayoutName | boolean | {
    layout: FormLayoutName | boolean,
    className: string,
    label: boolean,
    cols: number[],
    [key: string]: any,
};

declare type FormInputType = {
    name?: string,
    value?: any,
    onChange?: (...args: any[]) => any,
};