import * as React from 'react';
import {useMemo} from 'react';
import _merge from 'lodash-es/merge';
import {getList} from '@steroidsjs/core/reducers/list';
import {ITreeProps} from '@steroidsjs/core/ui/nav/Tree/Tree';
import useTree, {IPreparedTreeItem, ITreeItem} from '../../../hooks/useTree';
import {IColumnViewProps, IGridColumn, IGridProps} from '../Grid/Grid';
import Grid from '../Grid';
import useSelector from '../../../hooks/useSelector';

export interface ITreeColumnViewProps extends IColumnViewProps, Pick<ITreeTableProps, 'levelPadding' | 'customIcon' > {
    item: IPreparedTreeItem,
}

/**
 * TreeTable
 *
 * Компонент для представления данных коллекции в виде иерархической структуры.
 */
export interface ITreeTableProps extends Omit<IGridProps, 'items'>,
    Pick<ITreeProps, 'alwaysOpened' | 'levelPadding' | 'customIcon' | 'saveInClientStorage'>{
    /**
     * Элементы коллекции
     * @example
     * [
     *  {
     *   id: 1,
     *   name: 'Jane'
     *  },
     *  {
     *   id: 2,
     *   name: 'John',
     *   items: [...]
     *  }
     * ]
     */
    items?: ITreeItem[],

    customIcon?: string | React.ReactElement,
}

const TREE_COLUMN_VIEW_FIELDS = {
    valueView: 'TreeColumnView',
    headerClassName: 'TreeColumnHeader',
};

export const addTreeColumnFieldsToFirstColumn = (columns: IGridColumn[], levelPadding: string | number, customIcon?: string | React.ReactElement) => {
    const newColumns = [...columns];

    // Add tree view to the first column
    _merge(newColumns[0], {
        ...TREE_COLUMN_VIEW_FIELDS,
        levelPadding,
        customIcon,
    });

    return newColumns;
};

export default function TreeTable(props: ITreeTableProps): JSX.Element {
    const columns = useMemo(
        () => addTreeColumnFieldsToFirstColumn(props.columns, props.levelPadding, props.customIcon),
        [props.columns, props.customIcon, props.levelPadding],
    );

    const list = useSelector(state => getList(state, props.listId));

    const {treeItems} = useTree({
        items: props.items,
        autoOpenLevels: 0,
        alwaysOpened: props.alwaysOpened,
        currentPage: list?.page,
        itemsOnPage: list?.pageSize,
        saveInClientStorage: props.saveInClientStorage,
        clientStorageId: props.listId,
    });

    return (
        <Grid
            {...props}
            columns={columns}
            items={treeItems}
            itemsIndexing={false}
        />
    );
}

TreeTable.defaultProps = {
    levelPadding: 32,
    alwaysOpened: false,
    saveInClientStorage: false,
};
