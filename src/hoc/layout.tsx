import * as React from 'react';

import {IComponentsHocOutput} from './components';
import {IRouteItem} from '../ui/nav/Router/Router';
import useLayout from '../hooks/useLayout';

/**
 * Layout HOC
 * Используется для макета (layout) приложения, добавляя в него данные авторизации и статуса рендера страницы.
 * Передаваемый первым аргументом `initAction` будет вызываться каждый раз, когда необходимо обновить данные
 * авторизации (первая загрузка страницы, логин/регистация и выход).
 */
export interface ILayoutHocInput {
    route?: IRouteItem,
    user?: {
        role: string,
    },
    data?: Record<string, unknown>,
    initializeCounter?: number,
    components: IComponentsHocOutput,
    isInitialized?: boolean,
    redirectPageId?: any,
}

export interface ILayoutHocOutput {
    http?: any,
    status: string,
    renderError: string,
    route: IRouteItem,
    user: any,
    data: any,
    isInitialized: boolean,
}

export default (initAction: any = null): any => WrappedComponent => function LayoutHoc(props) {
    const layoutProps = useLayout(initAction);
    return (
        <WrappedComponent
            {...props}
            status={layoutProps.status}
            renderError={layoutProps.error}
            {...layoutProps.data}
        />
    );
};
