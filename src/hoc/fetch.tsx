import * as React from 'react';
import {useSelector} from 'react-redux';
import {useCallback, useMemo} from 'react';
import {getRouteParams} from '../reducers/router';
import useFetch, {IFetchConfig} from '../hooks/useFetch';

export interface IFetchHocOutput {
    fetchRefresh?: (ids?: string | string[]) => void,
    fetchUpdate?: (props: any) => void,
}

export type IFetchHocConfigFunc = (props: any) => IFetchConfig & {key: string}

interface IFetchHocOptions {
    waitLoading?: any,
}

export default (
    configFunc: IFetchHocConfigFunc,
    options: IFetchHocOptions = {},
): any => WrappedComponent => function FetchHoc(props) {
    const params = useSelector(state => getRouteParams(state));
    const config = useMemo(() => configFunc({...props, params}), [params, props]);
    const {data, isLoading, fetch} = useFetch(config);

    const fetchRefresh = useCallback(() => fetch(), [fetch]);
    const fetchUpdate = useCallback((newParams) => fetch({params: newParams}), [fetch]);

    if (isLoading && options.waitLoading !== false) {
        // TODO Loader
        return null;
    }

    return (
        <WrappedComponent
            {...props}
            fetchRefresh={fetchRefresh}
            fetchUpdate={fetchUpdate}
            {...{[config.key]: data}}
        />
    );
};
