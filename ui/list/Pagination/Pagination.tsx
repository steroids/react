import * as React from 'react';
import {connect} from 'react-redux';
import _get from 'lodash-es/get';
import {components} from '../../../hoc';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IComponentsHocOutput} from '../../../hoc/components';
import {ListControlPosition} from '../../../hoc/list';
import {IButtonProps} from '../../form/Button/Button';

export interface IPaginationProps {
    page?: number,
    pageSize?: number,
    total?: number,
    enable?: boolean,
    attribute?: string,
    defaultValue?: number | null,
    aroundCount?: number;
    loadMore?: boolean,
    className?: CssClassName;
    position?: ListControlPosition,
    buttonProps?: IButtonProps,
    view?: CustomView,
    onChange?: (value: number) => void,
}

export interface IPaginationViewProps extends IPaginationProps {
    totalPages: number,
    pages: {
        page?: number,
        label: string,
        isActive: boolean,
    }[],
    onSelect: (page: number) => void,
    onSelectNext: () => void,
}

interface IPaginationPrivateProps extends IConnectHocOutput, IComponentsHocOutput {
    listId?: string;
    list?: {
        page?: number,
        pageSize?: number,
        total?: number
    };
    syncWithAddressBar?: boolean;
    page?: any;
    formId?: string;
}

@connect()
@components('ui')
export default class Pagination extends React.PureComponent<IPaginationProps & IPaginationPrivateProps> {

    constructor(props) {
        super(props);
        this._onSelect = this._onSelect.bind(this);
        this._onSelectNext = this._onSelectNext.bind(this);
    }

    render() {
        const page = this.props.page;
        const totalPages = Math.ceil((this.props.total || 0) / (this.props.pageSize || 1));

        // Do not show in last page in 'loadMore' mode
        if (this.props.loadMore && page >= totalPages) {
            return null;
        }

        const PaginationView = this.props.view ||
            (this.props.loadMore
                ? this.props.ui.getView('list.PaginationMoreView')
                : this.props.ui.getView('list.PaginationButtonView'));
        return (
            <PaginationView
                {...this.props}
                totalPages={totalPages}
                pages={this.generatePages(page, totalPages).map(page => ({
                    page: page !== '...' ? page : null,
                    label: page,
                    isActive: _get(this.props, 'list.page') === page
                }))}
                onSelect={this._onSelect}
                onSelectNext={this._onSelectNext}
            />
        );
    }

    generatePages(page, totalPages) {
        if (!page || !totalPages) {
            return [];
        }

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            // Store first and last
            if (i === 1 || i === totalPages) {
                pages.push(i);
                continue;
            }
            // Store around
            if (
                page - this.props.aroundCount < i &&
                i < page + this.props.aroundCount
            ) {
                pages.push(i);
                continue;
            }
            if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    }

    _onSelect(page) {
        if (this.props.onChange && page) {
            this.props.onChange(page);
        }
    }

    _onSelectNext() {
        this._onSelect(this.props.list.page + 1);
    }

}
