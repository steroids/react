import {useContext} from 'react';
import {ComponentsContext} from '@steroidsjs/core/hooks/useApplication';

export interface IComponents {
    api?: any,
    clientStorage?: any,
    html?: any,
    http?: any,
    locale?: any,
    store?: any,
    ui?: any,
    resource?: any,
    ws?: any,
    pushNotification?: any,
    meta?: any,
    [key: string]: any,
}

export default function useComponents(): IComponents {
    const components = useContext(ComponentsContext);

    if (typeof window !== 'undefined' && window.SteroidsComponents) {
        return window.SteroidsComponents;
    }

    return components;
}
