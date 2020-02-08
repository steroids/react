declare module '*.json' {
    const value: any;
    export default value;
}

declare function __(str: string, params?: any): string;

declare type ColorName = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark' | string;

declare type PrimaryKey = number | string;

declare type Size = 'sm' | 'md' | 'lg' | string;

