import * as React from 'react';
import _isEqual from 'lodash-es/isEqual';
import {useMemo} from 'react';
import {usePrevious} from 'react-use';

/**
 * Normalize hook
 * Приводит данные к единому виду. Используется, когда данные в `props` могут быть записаны в нескольких форматах. На
 * выходе в отдельный `props` будут прокидываться "нормализованные" данные. При обновлении поля с оригинальными данными,
 * процесс нормализации будет повторяться.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface INormalizeHookInput {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface INormalizeHookOutput {

}

export interface INormalizeHookConfig {
    fromKey: string,
    toKey: string,
    normalizer: (value: any, props: any) => any,
}

interface IParams {
    [key: string]: any,
}

const normalize = (configs: INormalizeHookConfig[], props: IParams): IParams => {
    const data = {};
    configs.forEach(config => {
        data[config.toKey] = config.normalizer(
            props[config.fromKey],
            {...props, ...data},
        );
    });
    return data;
};

function useNormalize(props: IParams, configs: INormalizeHookConfig | INormalizeHookConfig[]): INormalizeHookOutput {
    const previousProps = usePrevious(props);

    const state = useMemo(() => {
        const toNormalize = []
            .concat(configs).filter(config => !_isEqual(previousProps[config.fromKey], props[config.fromKey]));
        return normalize(toNormalize, props);
    }, [configs]);

    return {...props, ...state};
}

export default useNormalize;
