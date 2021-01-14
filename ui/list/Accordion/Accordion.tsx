import * as React from 'react';
import _get from 'lodash-es/get';
import {components, list} from '../../../hoc';
import {IListHocInput, IListHocOutput} from '../../../hoc/list';
import {IComponentsHocOutput} from '../../../hoc/components';
import {ReactNode} from 'react';

export interface IAccordionProps extends IListHocInput {
    itemView: any;
    itemProps?: any;
    headerView: any;
    headerProps?: any;
    headerLabelAttribute?: string;
    view?: any;
    openFirst?: boolean;
    openedId?: number | string;
    onToggle?: (...args: any[]) => any;
    [key: string]: any,
}

export interface IAccordionViewProps extends IListHocOutput {
    renderHeader: (item: object, index?: number) => void,
    renderItem: (item: object, index?: number) => ReactNode,
    openedId: PrimaryKey,
    onToggle: (item: object) => void,
    items: {
        id: PrimaryKey,
        isOpened: boolean,
    }[]
}

export interface IAccordionHeaderViewProps extends IListHocOutput {
    id: PrimaryKey,
    item: object,
    index: number,
    isOpened: boolean,
}

export interface IAccordionItemViewProps extends IListHocOutput {
    id: PrimaryKey,
    item: object,
    index: number,
    isOpened: boolean,
}

interface IAccordionPrivateProps extends IListHocOutput, IComponentsHocOutput {

}

interface AccordionState {
    openedId?: any
}

@list()
@components('ui')
export default class Accordion extends React.PureComponent<IAccordionProps & IAccordionPrivateProps, AccordionState> {

    static defaultProps = {
        openFirst: true
    };

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._onToggle = this._onToggle.bind(this);
        this.state = {
            openedId:
                this.props.openedId ||
                (this.props.openFirst
                    ? _get(this.props, ['items', '0', this.props.primaryKey]) || 0
                    : null)
        };
    }

    componentDidMount() {
        if (this.props.onToggle && this.state.openedId) {
            this.props.onToggle(this.state.openedId);
        }
    }

    render() {
        const AccordionView =
            this.props.view || this.props.ui.getView('list.AccordionView');
        return (
            <AccordionView
                {...this.props}
                renderHeader={this._renderHeader}
                renderItem={this._renderItem}
                openedId={this.state.openedId}
                onToggle={this._onToggle}
                items={this.props.items.map((item, index) => {
                    const id = _get(item, this.props.primaryKey) || index;
                    return {
                        ...item,
                        id,
                        isOpened: this.state.openedId === id
                    };
                })}
            />
        );
    }

    _renderHeader(item, index) {
        const AccordionItemHeaderView =
            this.props.headerView ||
            this.props.ui.getView('list.AccordionItemHeaderView');
        return this._renderItemInternal(
            item,
            index,
            AccordionItemHeaderView,
            this.props.headerProps
        );
    }

    _renderItem(item, index) {
        return this._renderItemInternal(
            item,
            index,
            this.props.itemView,
            this.props.itemProps
        );
    }

    _renderItemInternal(item, index, ItemView, itemProps) {
        return (
            <ItemView
                {...this.props}
                {...itemProps}
                id={item.id}
                item={item}
                index={index}
                isOpened={item.isOpened}
            />
        );
    }

    _onToggle(item) {
        const openedId = this.state.openedId === item.id ? null : item.id;
        if (this.props.onToggle) {
            this.props.onToggle(item, !!openedId);
        }
        this.setState({openedId});
    }

}
