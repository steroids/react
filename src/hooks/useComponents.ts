import {useContext} from 'react';
import {ComponentsContext, IComponents} from '../providers/ComponentsProvider';

export default function useComponents(): IComponents {
    if (!process.env.IS_SSR) {
        return window.SteroidsComponents;
    }

    return useContext(ComponentsContext); // eslint-disable-line react-hooks/rules-of-hooks
}
