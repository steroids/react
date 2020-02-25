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

declare type FormLayout = 'default' | 'horizontal' | 'inline' | string;
