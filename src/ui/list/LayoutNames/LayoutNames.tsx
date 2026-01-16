import _get from 'lodash-es/get';
import React, {useCallback} from 'react';

import {IList, listSetLayout} from '../../../actions/list';
import {useComponents} from '../../../hooks';
import useDispatch from '../../../hooks/useDispatch';
import {ListControlPosition} from '../../../hooks/useList';
import {INavItem} from '../../nav/Nav/Nav';

/**
 * LayoutNames
 * Переключает варианты расположения элементов коллекции.
 * Сохраняет выбранный пользователем шаблон в LocalStorage.
 */
export interface ILayoutNamesProps {
    /**
     * Данные списка
     */
    list?: IList,

    /**
     * Отобразить переключатель
     * @example false
     */
    enable?: boolean,

    /**
     * Название ключа, под которым в LocalStorage сохранится значение выбранного шаблона
     * @example 'layout'
     */
    attribute?: string,

    /**
     * Шаблон по умолчанию
     * @example 'list'
     */
    defaultValue?: string,

    /**
     * Расположение переключателя
     * @example 'bottom'
     */
    position?: ListControlPosition,

    /**
     * Коллекция с шаблонами
     * @example
     * [
     *  {
     *   id: 'list',
     *   label: 'List'
     *  },
     *  {
     *   id: 'grid',
     *   label: 'Grid'
     *  }
     * ]
     */
    items?: INavItem[],

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,
}

export type ILayoutNamesViewProps = ILayoutNamesProps;

function LayoutNames(props: ILayoutNamesProps): JSX.Element {
    const components = useComponents();

    const dispatch = useDispatch();

    const list: IList = props.list || {};

    const onChange = useCallback((value) => {
        components.clientStorage.set(props.attribute, value);
        dispatch(listSetLayout(list.listId, value));
    }, [components.clientStorage, dispatch, list.listId, props.attribute]);

    if (props.enable === false) {
        return null;
    }

    const defaultComponent = require('../../nav/Nav').default;
    return components.ui.renderView(props.view || defaultComponent, {
        items: props.items,
        activeTab: list.layoutName || null,
        onChange,
    }, true);
}

LayoutNames.defaultProps = {
    enable: false,
    attribute: 'layout',
    defaultValue: null,
    position: 'top',
};

export const normalizeLayoutNamesProps = props => ({
    ...LayoutNames.defaultProps,
    enable: !!props,
    defaultValue: _get(props, 'items.0.id') || LayoutNames.defaultProps.defaultValue,
    ...(typeof props === 'boolean' ? {enable: props} : props),
});

export default React.memo(LayoutNames);
