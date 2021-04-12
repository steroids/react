import * as React from 'react';
import _get from 'lodash-es/get';
import _has from 'lodash-es/has';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useComponents, useSelector} from '../../../hooks';
import {
    getActiveRouteIds, getNavItems,
    getRouterParams,
    IRoute,
} from '../../../reducers/router';
import {IButtonProps} from '../../form/Button/Button';

export interface INavItem extends IButtonProps {
    id?: number | string,
    label?: string | any,
    url?: string,
    onClick?: (...args: any[]) => any,
    className?: CssClassName,
    view?: any,
    visible?: boolean,
    content?: any,
    contentProps?: any,
}

export interface INavProps {
    layout?: 'button' | 'icon' | 'link' | 'tabs' | 'navbar' | 'list' | string;
    items?: string | INavItem[];
    routes?: IRoute[],
    activeTab?: number | string;
    className?: CssClassName;
    view?: any;
    onChange?: (...args: any[]) => any;

    /**
     * Размер
     */
    size?: Size,

    /**
     * Темная тема
     */
    dark?: boolean,

    [key: string]: any;
}

export interface INavViewProps extends INavProps {
    onClick: (item: Record<string, unknown>, index: number) => void,
    items: (INavItem & {
        isActive: boolean,
    })[],
    navClassName?: CssClassName,
}

const defaultViewMap = {
    button: 'nav.NavButtonView',
    icon: 'nav.NavIconView',
    link: 'nav.NavLinkView',
    tabs: 'nav.NavTabsView',
    navbar: 'nav.NavBarView',
    list: 'nav.NavListView',
};

function Nav(props: INavProps) {
    const components = useComponents();

    const {routes, activeRouteIds, routerParams} = useSelector(state => ({
        routes: typeof props.items === 'string' ? getNavItems(state, props.items) : null,
        activeRouteIds: getActiveRouteIds(state),
        routerParams: getRouterParams(state),
    }));

    const [activeTab, setActiveTab] = useState(props.activeTab || _get(props, 'items.0.id') || 0);

    useEffect(() => {
        if (props.activeTab) {
            setActiveTab(props.activeTab);
        }
    }, [props.activeTab]);

    const renderContent = () => {
        const items = Array.isArray(props.items) ? props.items : [];
        const activeItem = items.find((item, index) => activeTab === (_has(item, 'id') ? item.id : index));
        if (!activeItem || !activeItem.content) {
            return null;
        }
        if (_isFunction(activeItem.content) || _isObject(activeItem.content)) {
            const ContentComponent = activeItem.content;
            return <ContentComponent {...activeItem} {...activeItem.contentProps} />;
        }
        return activeItem.content;
    };

    const onClick = useCallback((item, index) => {
        const newActiveTab = _has(item, 'id') ? item.id : index;
        if (props.onChange) {
            props.onChange.call(null, newActiveTab);
        } else {
            setActiveTab(newActiveTab);
        }
    }, [props.onChange]);

    const items = useMemo(() => (
        Array.isArray(props.items)
            ? props.items.map((item, index) => ({
                ...item,
                isActive: activeTab === (_has(item, 'id') ? item.id : index),
            }))
                .filter(item => item.visible !== false)
            : (routes || []).map(route => ({
                id: route.id,
                label: route.label,
                toRoute: route.id,
                toRouteParams: routerParams,
                visible: route.isNavVisible,
                isActive: (activeRouteIds || []).includes(route.id),
            } as INavItem))
                .filter(item => item.visible !== false)
    ),
    [activeRouteIds, activeTab, props.items, routerParams, routes]);

    return components.ui.renderView(props.view || defaultViewMap[props.layout], {
        ...props,
        items,
        onClick,
        children: renderContent(),
    });
}

Nav.defaultProps = {
    layout: 'button',
};

export default Nav;
