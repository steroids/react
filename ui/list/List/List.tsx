import * as React from 'react';
import _get from 'lodash-es/get';
import {components} from '../../../hoc';
import listHoc from '../listHoc';

interface IListProps {
    primaryKey?: string;
    items?: any[];
    itemView: any;
    itemProps?: any;
    view?: any;
    map?: any;
    getView?: any;
    ui?: any;
}

@listHoc()
@components('ui')
export default class List extends React.PureComponent<IListProps, {}> {
    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
    }

    render() {
        const ListView = this.props.view || this.props.ui.getView('list.ListView');
        return (
            <ListView
                {...this.props}
                content={this.props.items && this.props.items.map(this.renderItem)}
            />
        );
    }

    renderItem(item, index) {
        const ItemView = this.props.itemView;
        const id = _get(item, this.props.primaryKey);
        return (
            <ItemView
                {...this.props}
                {...this.props.itemProps}
                key={id || index}
                id={id}
                item={item}
                index={index}
            />
        );
    }
}
