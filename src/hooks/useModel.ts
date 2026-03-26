import {useMemo} from 'react';

import useComponents from './useComponents';
import {Model} from '../components/MetaComponent';

export default function useModel(model: any, defaultModel: any = null): Model {
    const components = useComponents();
    return useMemo(
        () => components.meta.normalizeModel(
            typeof model === 'string' ? components.meta.getModel(model) : model,
            defaultModel,
        ),
        [components.meta, defaultModel, model],
    );
}
