import {useMemo} from 'react';
import {Model} from '../components/MetaComponent';
import useComponents from './useComponents';

export default function useModel(model: any, defaultModel: any = null): Model {
    const components = useComponents();
    return useMemo(
        () => components.meta.normalizeModel(components.meta.getModel(model), defaultModel),
        [components.meta, defaultModel, model],
    );
}
