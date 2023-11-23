import * as React from 'react';
import {IPreparedTreeItem, ITreeConfig} from '../../../hooks/useTree';
import {useComponents, useTree} from '../../../hooks';

/**
 * Tree
 * Компонент, который представляет в виде дерева список с иерархической структурой данных
 */
export interface ITreeProps extends Omit<ITreeConfig, 'currentPage' | 'itemsOnPage'>{
    /**
     * Идентификатор (ключ) для сохранения в LocalStorage коллекции с раскрытыми узлами
     * @example 'exampleTree'
     */
    id?: string;

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
     * Обработчик на клик по узлу
     * @param args
     */
    onItemClick?: (...args: any[]) => any;

    /**
     * Отображать раскрытыми узлы из LocalStorage
     * @example true
     */
    autoSave?: boolean;

    [key: string]: any;
}

export interface ITreeViewProps extends ITreeProps {
    items: IPreparedTreeItem[],
    levelPadding?: number
}

function Tree(props: ITreeProps) {
    const components = useComponents();

    const {treeItems} = useTree({
        items: props.items,
        selectedItemId: props.selectedItemId,
        routerParams: props.routerParams,
        itemsKey: props.itemsKey,
        autoOpenLevels: props.autoOpenLevels,
        onExpand: props.onItemClick,
        level: props.level,
        alwaysOpened: props.alwaysOpened,
    });

    return components.ui.renderView(props.view || 'nav.TreeView', {
        ...props,
        items: treeItems,
    });
}

Tree.defaultProps = {
    itemsKey: 'items',
    autoOpenLevels: 1,
    autoSave: false,
    level: 0,
};

export default Tree;
