import * as React from 'react';
import {connect} from 'react-redux';
import _get from 'lodash-es/get';
import {components} from '../../../hoc';
import {setPageSize} from '../../../actions/list';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IComponentsHocOutput} from '../../../hoc/components';

interface IPaginationSizeProps {
    listId?: string;
    sizes?: number[];
    list?: {
        pageSize?: number
    };
    className?: string;
    view?: any;
    size?: 'sm' | 'md' | 'lg' | string;
}

interface IPaginationSizePrivateProps extends IConnectHocOutput, IComponentsHocOutput {

}

@connect()
@components('ui')
export default class PaginationSize extends React.PureComponent<IPaginationSizeProps & IPaginationSizePrivateProps> {

    static defaultProps = {
        sizes: [30, 50, 100],
        className: "",
        size: 'sm'
    };

    constructor(props) {
        super(props);
        this._onSelect = this._onSelect.bind(this);
    }

    render() {
        const PaginationSizeView =
            this.props.view || this.props.ui.getView('list.PaginationSizeView');
        return (
            <PaginationSizeView
                {...this.props}
                sizes={this.props.sizes.map(size => ({
                    size,
                    label: size,
                    isActive: _get(this.props, 'list.pageSize') === size
                }))}
                onSelect={this._onSelect}
            />
        );
    }

    _onSelect(size) {
        this.props.dispatch(setPageSize(this.props.listId, size));
    }

}
