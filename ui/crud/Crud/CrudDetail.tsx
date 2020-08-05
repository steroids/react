import * as React from 'react';
import {ICrudChildrenProps} from './Crud';
import Detail from '../../list/Detail';
import {fetch} from '../../../hoc';

@fetch(props => ({
    url: `${props.restUrl}/${props.itemId}`,
    key: 'item',
}))
export default class CrudGrid extends React.PureComponent<ICrudChildrenProps> {

    render() {
        return (
            <Detail
                item={this.props.item}
                model={this.props.model}
                attributes={[this.props.primaryKey]}
                {...this.props.detail}
            />
        );
    }
}
