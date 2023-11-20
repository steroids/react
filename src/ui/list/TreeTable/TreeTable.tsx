import * as React from 'react';
import {useMemo} from 'react';
import _merge from 'lodash-es/merge';

import {IColumnViewProps, IGridColumn, IGridProps} from '../Grid/Grid';
import Grid from '../Grid';

export interface ITreeColumnViewProps extends IColumnViewProps {
    item: ITreeTableItem & {
        uniqueId: string,
        level: number,
        isOpened: boolean,
        hasItems: boolean,
        onClick: () => void,
    },
}

export interface ITreeTableItem {
    /**
     * Идентификатор узла
     */
    id?: string | number,

    /**
     * Вложенные элементы
     * @example items: [{id: 3, name: 'Ivan'}]
     */
    items?: ITreeTableItem[],
}

/**
 * TreeTable
 *
 * Компонент для представления данных коллекции в виде иерархической структуры.
 */
export interface ITreeTableProps extends Omit<IGridProps, 'items'> {
    /**
     * Элементы коллекции
     * @example [{id: 1, name: 'Jane'}, {id: 2, name: 'John', items: [...]}]
     */
    items?: ITreeTableItem[],

    /**
     * Расстояние вложенных элементов от родителя для каждого уровня
     * @example 32
     */
    levelPadding?: number | string,
}

const TREE_COLUMN_VIEW_FIELDS = {
    valueView: 'TreeColumnView',
    headerClassName: 'TreeColumnHeader',
};

export const addTreeColumnFieldsToFirstColumn = (columns: IGridColumn[], levelPadding: string | number) => {
    const newColumns = [...columns];

    // Add tree view to the first column
    _merge(newColumns[0], {
        ...TREE_COLUMN_VIEW_FIELDS,
        levelPadding,
    });

    return newColumns;
};

export default function TreeTable(props: ITreeTableProps): JSX.Element {
    const columns = useMemo(
        () => addTreeColumnFieldsToFirstColumn(props.columns, props.levelPadding),
        [props.columns, props.levelPadding],
    );

    return (
        <Grid
            {...props}
            columns={columns}
            items={props.items}
            itemsIndexing={false}
            hasTreeItems
        />
    );
}

TreeTable.defaultProps = {
    levelPadding: 32,
};
