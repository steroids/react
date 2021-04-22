import * as React from 'react';
import Grid from '../../list/Grid';
import {getCrudGridId, ICrudChildrenProps} from './Crud';

export default function CrudGrid(props: ICrudChildrenProps) {
    return (
        <Grid
            listId={getCrudGridId(props)}
            action={props.restUrl}
            scope={['model', 'permission']}
            primaryKey={props.primaryKey}
            model={props.model}
            //searchModel={props.searchModel}
            controls={props.controlsGetter}
            columns={[props.primaryKey]}
            pagination={{
                loadMore: false,
            }}
            {...props.grid}
        />
    );
}
