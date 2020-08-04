import * as React from 'react';
import Grid from '../../list/Grid';
import {getCrudGridId, ICrudChildrenProps} from './Crud';

export default class CrudGrid extends React.PureComponent<ICrudChildrenProps> {

    render() {
        return (
            <Grid
                listId={getCrudGridId(this.props)}
                action={this.props.restUrl}
                scope={['model', 'permission']}
                primaryKey={this.props.primaryKey}
                model={this.props.model}
                //searchModel={this.props.searchModel}
                controls={this.props.controlsHandler}
                columns={[this.props.primaryKey]}
                pagination={{
                    loadMore: false,
                }}
                {...this.props.grid}
            />
        );
    }
}
