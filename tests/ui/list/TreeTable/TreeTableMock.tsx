import {useMemo} from 'react';
import * as React from 'react';
import _merge from 'lodash-es/merge';
import Grid from '../../../../src/ui/list/Grid';
import {ITreeTableProps} from '../../../../src/ui/list/TreeTable/TreeTable';
import TreeColumnView from './TreeColumnMockView';

export default function TreeTableMock(props: ITreeTableProps): JSX.Element {
    // Add tree view to the first column
    const columns = useMemo(() => {
        const newColumns = [...props.columns];

        const additionalFields = {
            valueView: TreeColumnView,
            headerClassName: 'TreeColumnHeader',
        };

        _merge(newColumns[0], additionalFields);

        return newColumns;
    }, [props.columns]);

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
