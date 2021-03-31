import * as React from 'react';
import _get from 'lodash-es/get';
import {useComponents} from '@steroidsjs/core/hooks';
import {INavItem} from '@steroidsjs/core/ui/nav/Nav/Nav';
import {ListControlPosition} from '@steroidsjs/core/hooks/useList';
import {useCallback} from 'react';
import {IList, listSetLayout} from '@steroidsjs/core/actions/list';
import useDispatch from '@steroidsjs/core/hooks/useDispatch';

export interface ILayoutNamesProps {
    list?: IList,
    enable?: boolean,
    attribute?: string,
    defaultValue?: string,
    position?: ListControlPosition,
    items?: INavItem[],
    view?: CustomView,
}

export type ILayoutNamesViewProps = ILayoutNamesProps;

function LayoutNames(props: ILayoutNamesProps) {
    const components = useComponents();

    const dispatch = useDispatch();

    const onChange = useCallback((value) => {
        components.clientStorage.set(props.attribute, value);
        dispatch(listSetLayout(props.list.listId, value));
    }, [components.clientStorage, dispatch, props.attribute, props.list.listId]);

    if (props.enable === false) {
        return null;
    }

    const defaultComponent = require('../../nav/Nav').default;
    return components.ui.renderView(props.view || defaultComponent, {
        items: props.items,
        activeTab: props.list.layoutName || null,
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
