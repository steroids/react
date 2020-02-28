import * as React from 'react';
import _get from 'lodash-es/get';
import {components, list} from '../../../hoc';
import {IListHocInput, IListHocOutput} from '../../../hoc/list';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IListProps extends IListHocInput {
    itemView?: React.ComponentType;
    itemProps?: object;
    view?: React.ComponentType;
    className?: string;
    contentClassName?: string;
}

export interface IListViewProps extends IListProps, IListHocOutput {
    content: any,
}

export interface IListItemViewProps extends IListProps, IListHocOutput {
    id: PrimaryKey,
    item: {
        id?: PrimaryKey,
        title?: string | any,
        label?: string | any,
    },
    index: number,
    className?: string;
    contentClassName?: string;
    layoutSelected?: PrimaryKey;
}

interface IListPrivateProps extends IListHocOutput, IComponentsHocOutput {

}

@list()
@components('ui')
export default class List extends React.PureComponent<IListProps & IListPrivateProps> {
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
        const ItemView = this.props.itemView || this.props.ui.getView('list.ListItemView');
        const id = _get(item, this.props.primaryKey);
        const itemProps = {
            ...this.props,
            ...this.props.itemProps,
            id,
            item,
            index,
        } as IListItemViewProps;

        return (
            <ItemView
                {...this.props}
                {...this.props.itemProps}
                {...itemProps}
                key={id || index}
            />
        );
    }
}
