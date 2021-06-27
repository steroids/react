//import {useContext} from 'react';

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
    if (typeof window !== 'undefined' && window.SteroidsComponents) {
        return window.SteroidsComponents;
    }
    // TODO Get components from context
    //return useContext(ComponentsContext);
    return null;
}
