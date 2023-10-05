import {IListConfig, defaultConfig} from '../useList';

export const normalizeSortProps = (props: IListConfig['sort']) => ({
    ...defaultConfig.sort,
    enable: !!props,
    ...(typeof props === 'boolean' ? {enable: props} : props),
});
