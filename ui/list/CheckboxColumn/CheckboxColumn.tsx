import * as React from 'react';
import {connect} from 'react-redux';
import _get from 'lodash/get';
import {components} from '../../../hoc';
import {toggleAll, toggleItem} from '../../../actions/list';
import {isChecked, isCheckedAll} from '../../../reducers/list';

interface ICheckboxColumnProps {
    primaryKey?: string;
    item?: any;
    fieldProps?: any;
    isChecked?: boolean;
    listId?: any;
    dispatch?: any;
    getView?: any;
    ui?: any;
    view?: any;
}

@connect((state, props) => ({
    isChecked: props.item
        ? isChecked(state, props.listId, _get(props.item, props.primaryKey))
        : isCheckedAll(state, props.listId)
}))
@components('ui')
export default class CheckboxColumn extends React.PureComponent<ICheckboxColumnProps,
    {}> {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }

    render() {
        const CheckboxColumnView =
            this.props.view || this.props.ui.getView('list.CheckboxColumnView');
        return (
            <CheckboxColumnView
                {...this.props}
                fieldProps={{
                    fieldId:
                        this.props.listId +
                        '_checkbox_' +
                        (this.props.item ? this.props.item[this.props.primaryKey] : 'all'),
                    ...this.props.fieldProps
                }}
                input={{
                    name: this.props.listId + '_checkbox',
                    value: this.props.isChecked,
                    onChange: this._onChange
                }}
            />
        );
    }

    _onChange() {
        if (this.props.item) {
            this.props.dispatch(
                toggleItem(
                    this.props.listId,
                    _get(this.props.item, this.props.primaryKey)
                )
            );
        } else {
            this.props.dispatch(toggleAll(this.props.listId));
        }
    }
}
