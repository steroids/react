import {useContext} from 'react';
import {ComponentsContext} from '../providers/ComponentsProvider';
import {IComponents} from '../providers/ComponentsProvider';

export default function useComponents(): IComponents {
    const components = useContext(ComponentsContext);

    if (!process.env.IS_SSR) {
        return window.SteroidsComponents;
    }

    return components;
}
