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

export default function (): IComponentsHookOutput {
    if (process.env.APP_COMPONENTS_GLOBAL) {
        return window['SteroidsComponents'];
    } else {
        // TODO Get components from context
        //return useContext(ComponentsContext);
    }
}
