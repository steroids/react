//import {useContext} from 'react';

export interface IComponentsHookOutput {
    clientStorage?: any,
    html?: any,
    http?: any,
    locale?: any,
    store?: any,
    ui?: any,
    resource?: any,
    ws?: any,
    pushNotification?: any,
}

export default function useComponents(): IComponentsHookOutput {
    if (typeof window !== 'undefined' && window.SteroidsComponents) {
        return window.SteroidsComponents;
    }
    // TODO Get components from context
    //return useContext(ComponentsContext);
    return null;
}
