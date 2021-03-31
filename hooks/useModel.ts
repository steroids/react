import {useMemo} from 'react';
import {getModel} from '@steroidsjs/core/reducers/fields';
import {Model} from '@steroidsjs/core/components/MetaComponent';
import useComponents from './useComponents';
import useSelector from './useSelector';

export default function useModel(model: any, defaultModel: any = null): Model {
    const components = useComponents();

    model = useSelector(state => getModel(state, model));
    return useMemo(
        () => components.meta.normalizeModel(model, defaultModel),
        [components.meta, defaultModel, model],
    );
}
