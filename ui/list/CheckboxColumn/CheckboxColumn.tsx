import * as React from 'react';
import _get from 'lodash-es/get';
import {connect, components} from '../../../hoc';
import {toggleAll, toggleItem} from '../../../actions/list';
import {isChecked, isCheckedAll} from '../../../reducers/list';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface ICheckboxColumnProps {
    fieldProps?: any;
    view?: any;
    [key: string]: any,
}

export interface ICheckboxColumnViewProps {
    fieldProps: {
    },
    input: {
        name: string,
        value: any,
        onChange: any,
    },
}

interface ICheckboxColumnPrivateProps extends IConnectHocOutput, IComponentsHocOutput {
    listId?: any;
    item?: any;
    primaryKey?: string;
    isChecked?: boolean;
}

@connect((state, props) => ({
    isChecked: props.item
        ? isChecked(state, props.listId, _get(props.item, props.primaryKey))
        : isCheckedAll(state, props.listId),
}))
@components('ui')
export default class CheckboxColumn extends React.PureComponent<ICheckboxColumnProps & ICheckboxColumnPrivateProps> {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }

    render() {
        const CheckboxColumnView = this.props.view || this.props.ui.getView('list.CheckboxColumnView');
        return (
            <CheckboxColumnView
                {...this.props}
                input={{
                    name: this.props.listId + '_checkbox',
                    value: this.props.isChecked,
                    onChange: this._onChange,
                }}
            />
        );
    }

    _onChange() {
        if (this.props.item) {
            this.props.dispatch(
                toggleItem(
                    this.props.listId,
                    _get(this.props.item, this.props.primaryKey),
                ),
            );
        } else {
            this.props.dispatch(toggleAll(this.props.listId));
        }
    }
}
