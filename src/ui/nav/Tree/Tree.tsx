import React, {useMemo} from 'react';

import {useComponents, useTree} from '../../../hooks';
import {IPreparedTreeItem, ITreeConfig, ITreeItem} from '../../../hooks/useTree';

export interface ITreeViewProps extends ITreeProps {
    items: IPreparedTreeItem[],
    onItemFocus?: () => void,
}

export interface ITreeItemViewProps extends ITreeProps {
    item: IPreparedTreeItem,
    children?: JSX.Element,
    withoutPointerOnLabel?: boolean,
}

/**
 * Tree
 * Компонент, который представляет в виде дерева список с иерархической структурой данных
 *
 * Дополнительный функционал: в кастомном view компонента есть возможность реализовать кнопку, по клику на которую
 * будет вызываться функция props.onItemFocus. Данная функция "находит" текущий роут в дереве -
 * раскрывает родительские уровни, делает элемент активным.
 * Данная функция не включает скролл к активному компоненту внутри дерева, это также необходимо
 * реализовать в кастомном view локально в проекте.
 */
export interface ITreeProps extends Omit<ITreeConfig, 'currentPage' | 'itemsOnPage'> {
    /**
     * Идентификатор (ключ) для сохранения в LocalStorage коллекции с раскрытыми узлами
     * @example 'exampleTree'
     */
    id?: string,

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
     * Обработчик на клик по узлу
     * @param args
     */
    onItemClick?: (event: React.MouseEvent, item: ITreeItem) => any,

    /**
     * Отображать раскрытыми узлы из LocalStorage
     * @example true
     */
    autoSave?: boolean,

    /**
     * Расстояние вложенных элементов от родителя для каждого уровня
     * @example 32
     */
    levelPadding?: number,

    /**
     * Скрыть иконку c лева от элемента
     * @example true
     */
    hideIcon?: boolean,

    /**
     * Кастомная иконка, заменяющая иконку раскрытия по умолчанию
     */
    customIcon?: string | React.ReactElement,

    /**
     * Флаг, определяющий раскрывать вложенные элементы по клику на весь элемент или только на иконку
     * @example false
     */
    hasIconExpandOnly?: boolean,

    [key: string]: any,
}

export default function Tree(props: ITreeProps) {
    const components = useComponents();

    const {treeItems, onItemFocus} = useTree({
        items: props.items,
        selectedItemId: props.selectedItemId,
        routerParams: props.routerParams,
        itemsKey: props.itemsKey,
        autoOpenLevels: props.autoOpenLevels,
        onExpand: props.onItemClick,
        level: props.level,
        alwaysOpened: props.alwaysOpened,
        useSameSelectedItemId: props.useSameSelectedItemId,
        collapseChildItems: props.collapseChildItems,
        saveInClientStorage: props.autoSave,
        clientStorageId: props.id,
    });

    const viewProps = useMemo(() => ({
        ...props,
        onItemFocus,
        items: treeItems,
        levelPadding: props.levelPadding,
        className: props.className,
        hideIcon: props.hideIcon,
        customIcon: props.customIcon,
        hasIconExpandOnly: props.hasIconExpandOnly,
    }), [props, treeItems, onItemFocus]);

    return components.ui.renderView(props.view || 'nav.TreeView', viewProps);
}

Tree.defaultProps = {
    itemsKey: 'items',
    autoOpenLevels: 1,
    autoSave: false,
    level: 0,
    levelPadding: 32,
    hasIconExpandOnly: false,
    useSameSelectedItemId: true,
    hideIcon: false,
    saveInClientStorage: false,
    collapseChildItems: false,
};
