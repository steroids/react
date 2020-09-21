import * as React from 'react';
import _get from 'lodash-es/get';
import _upperFirst from 'lodash-es/upperFirst';
import _isString from 'lodash-es/isString';
import _isObject from 'lodash-es/isObject';
import _isFunction from 'lodash-es/isFunction';
import {components, list} from '../../../hoc';
import ControlsColumn from '../ControlsColumn';
import Format from '../../format/Format';
import {IListHocInput, IListHocOutput} from '../../../hoc/list';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IDetailColumn} from '../Detail/Detail';
import {IControlItem} from '../../nav/Controls/Controls';
import {IFormProps} from '../../form/Form/Form';

export interface IGridColumn {
    attribute?: string,
    format?:
        | string
        | {
        component?: string | ((...args: any[]) => any)
    },
    label?: React.ReactNode,
    hint?: React.ReactNode,
    headerClassName?: CssClassName,
    visible?: boolean,
    headerView?: any,
    headerProps?: any,
    valueView?: any,
    valueProps?: any,
    className?: CssClassName,
    sortable?: boolean,
}

export interface IGridProps extends IListHocInput {
    view?: any;
    columns: (string | IGridColumn)[];
    controls?: IControlItem[] | ((item: any, primaryKey: string) => IControlItem[]);
    model?: any;
    label?: any;
    fields?: any;
    searchForm?: IFormProps;
    itemsIndexing?: any;
    onSort?: (arg: string) => void;
    fetch?: () => void;
}

export interface IGridViewProps extends IGridProps, IGridPrivateProps {
    renderValue: (item: object, column: IDetailColumn | IGridColumn) => any,
    columns: (IGridColumn & {
        label: any,
    })[],
    className: CssClassName,
}

interface IGridPrivateProps extends IListHocOutput, IComponentsHocOutput {
    list?: any;
}

@list()
@components('ui')
export default class Grid extends React.PureComponent<IGridProps & IGridPrivateProps> {
    constructor(props) {
        super(props);
        this.renderValue = this.renderValue.bind(this);
    }

    render() {
        if (
            (this.props.scope || []).includes('model') &&
            !this.props.list.isFetched
        ) {
            return null;
        }
        const columns = this.props.columns
            .map(column => (_isString(column) ? {attribute: column} : column))
            .filter((column: IGridColumn) => column.visible !== false);
        if (this.props.controls) {
            columns.push({
                valueView: ControlsColumn,
                valueProps: {
                    controls: this.props.controls
                }
            });
        }
        if (this.props.itemsIndexing) {
            columns.unshift({
                label: __('№'),
                valueView: props => props.item.index
            });
        }
        const GridView = this.props.view || this.props.ui.getView('list.GridView');
        return (
            <GridView
                {...this.props}
                renderValue={this.renderValue}
                columns={columns.map((column: IGridColumn) => ({
                    ...column,
                    label: this.renderLabel(column)
                }))}
            />
        );
    }

    renderLabel(column) {
        if (column.headerView) {
            const HeaderView = column.headerView;
            return (
                <HeaderView
                    {...column}
                    {...column.headerProps}
                    listId={this.props.listId}
                />
            );
        }
        if (column.label || column.label === '') {
            return column.label;
        }
        const autoLabel = _upperFirst(column.attribute);
        if (_isObject(this.props.model)) {
            if (_isFunction(this.props.model.formatters)) {
                return (
                    _get(this.props.model.formatters(), [column.attribute, 'label']) ||
                    autoLabel
                );
            }
            if (_get(this.props, ['model', 'formatters', column.attribute])) {
                return this.props.model.formatters[column.attribute].label || autoLabel;
            }
        }
        if (_isObject(_get(this.props, 'searchForm.model'))) {
            if (_isFunction(this.props.searchForm.model.fields)) {
                return (
                    _get(this.props.searchForm.model.fields(), [
                        column.attribute,
                        'label'
                    ]) || autoLabel
                );
            }
            if (
                _get(this.props, ['searchForm', 'model', 'fields', column.attribute])
            ) {
                return (
                    this.props.searchForm.model.fields[column.attribute].label ||
                    autoLabel
                );
            }
        }
        return autoLabel;
    }

    renderValue(item, column) {
        // Custom component
        if (column.valueView) {
            const ValueView = column.valueView;
            return (
                <ValueView
                    {...column}
                    {...column.valueProps}
                    listId={this.props.listId}
                    primaryKey={this.props.primaryKey}
                    item={item}
                />
            );
        }
        return <Format item={item} model={this.props.model} {...column} />;
    }
}
