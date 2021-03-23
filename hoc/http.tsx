import * as React from 'react';
import {useCallback} from 'react';
import useFetch from '../hooks/useFetch';

/**
 * Http HOC
 * Обертка для асинхронного получения данных с бекенда. В отличии от `Fetch HOC`, он не хранит данные в Redux Store
 * и не добавляет "Загрузка..." при запросе.
 */
export default (requestFunc: (props: any) => any): any => WrappedComponent => function HttpHoc(props) {
    const onFetch = useCallback(() => requestFunc(props), [props]);
    const {data, isLoading, fetch} = useFetch({onFetch});
    const fetchUpdate = useCallback((newParams) => fetch({params: newParams}), [fetch]);

    return (
        <WrappedComponent
            {...props}
            {...data}
            isLoading={isLoading}
            fetch={fetchUpdate}
        />
    );
};
