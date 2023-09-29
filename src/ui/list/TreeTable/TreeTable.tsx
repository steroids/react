import * as React from 'react';
import Grid from '../Grid';
import {IGridProps} from '../Grid/Grid';

interface ITreeTableProps extends IGridProps {
    isForTreeTable?: boolean
}

export default function TreeTable(props: ITreeTableProps): JSX.Element {
    return (
        <Grid
            columns={props.columns}
            items={props.items}
        />
    );
}
