import * as React from 'react';
import _get from 'lodash-es/get';
import _has from 'lodash-es/has';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useComponents, useSelector} from '../../../hooks';
import {
    getActiveRouteIds, getNavItems, getRouteParams,
    getRouterParams,
} from '../../../reducers/router';
import {IButtonProps} from '../../form/Button/Button';

export interface INavItem extends IButtonProps {
    /**
     * Идентификатор элемента
     */
    id?: number | string,

    /**
     * Текст элемента
     * @example 'Отзывы'
     */
    label?: string | any,

    /**
     * Ссылка на внешнюю страницу
     * @example https://ya.ru
     */
    url?: string,

    /**
     * Обработчик события нажатия
     * @param args
     */
    onClick?: (...args: any[]) => any,

    /**
     * CSS-класс для элемента отображения
     */
    className?: CssClassName,

    /**
     * Переопределение view React компонента для кастомизации отображения элемента
     * @example MyCustomView
     */
    view?: CustomView,

    /**
     * Видимость элемента
     * @example true
     */
    visible?: boolean,

    /**
     * Контент, который отобразиться, если элемент навигации будет активен
     * @example ContentComponent
     */
    content?: any,

    /**
     * Свойства для компонента с контентом
     * @example {content: 'Some text'}
     */
    contentProps?: any,
}

/**
 * Nav
 * Компонент навигации
 */
export interface INavProps {
    /**
     * Шаблон отображения элементов навигации
     * @example 'link'
     */
    layout?: 'button' | 'icon' | 'link' | 'tabs' | 'navbar' | 'list' | string;

    /**
     * Коллекция с элементами навигации. Также можно передать идентификатор роута, тогда компонент найдет все
     * вложенные роуты и отобразит их в навигации.
     * @example [{id: 1, label: 'One'}, {id: 2, label: 'Two'}] | 'root'
     */
    items?: string | INavItem[];

    /**
     * Идентификатор активного элемента. По умолчанию будет активен первый элемент.
     * @example 1
     */
    activeTab?: number | string;

    /**
     * CSS-класс для элемента отображения
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения элемента
     * @example MyCustomView
     */
    view?: CustomView;

    /**
     * Обработчик, который вызывается при смене активного элемента навигации
     * @param args
     */
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

function Nav(props: INavProps): JSX.Element {
    const components = useComponents();

    const {routes, activeRouteIds, routerParams} = useSelector(state => ({
        routes: typeof props.items === 'string' ? getNavItems(state, props.items) : null,
        activeRouteIds: getActiveRouteIds(state),
        routerParams: getRouteParams(state),
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
            return (
                <ContentComponent
                    {...activeItem}
                    {...activeItem.contentProps}
                />
            );
        }
        return activeItem.content;
    };

    const onClick = useCallback((item, index) => {
        const newActiveTab = _has(item, 'id') ? item.id : index;
        setActiveTab(newActiveTab);
        if (props.onChange) {
            props.onChange.call(null, newActiveTab);
        }
    }, [props.onChange]);

    const items = useMemo(() => (
        Array.isArray(props.items)
            ? props.items.map((item, index) => ({
                ...item,
                isActive: activeTab === (_has(item, 'id') ? item.id : index),
            }))
                .filter(item => item.visible !== false)
            : (routes as INavItem[] || []).map(route => ({
                id: route.id,
                label: route.label,
                toRoute: route.id,
                toRouteParams: routerParams,
                visible: route.isNavVisible,
                isActive: (activeRouteIds || []).includes(route.id),
            }))
                .filter(item => item.visible !== false)
    ),
    [activeRouteIds, activeTab, props.items, routerParams, routes]);

    return components.ui.renderView(props.view || defaultViewMap[props.layout], {
        ...props,
        items,
        onClick,
        disabled: props.disabled,
        children: renderContent(),
    });
}

Nav.defaultProps = {
    layout: 'button',
    size: 'md',
};

export default Nav;
