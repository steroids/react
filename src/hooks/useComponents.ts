import {useContext} from 'react';
import {ComponentsContext, IComponents} from '../providers/ComponentsProvider';

export default function useComponents(): IComponents {
    const components = useContext(ComponentsContext);

    if (!process.env.IS_SSR) {
        return window.SteroidsComponents;
    }

    return components;
}
