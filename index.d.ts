declare module '*.json' {
    const value: any;
    export default value;
}

declare function __(str: string, params?: any): string;