import * as React from 'react';
import {connect} from 'react-redux';
import _get from 'lodash-es/get';
import {components} from '../../../hoc';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IComponentsHocOutput} from '../../../hoc/components';
import {ListControlPosition} from '../../../hoc/list';

export interface IPaginationSizeProps {
    enable?: boolean,
    attribute?: string,
    defaultValue?: number | null,
    sizes?: number[];
    position?: ListControlPosition,
    className?: CssClassName;
    size?: Size;
    view?: CustomView,
    onChange?: (value: number) => void,
    [key: string]: any,
}

export interface IPaginationSizeViewProps extends IPaginationSizeProps {
    items: {
        size: number,
        label: string | number,
        isActive: boolean,
    }[],
    onSelect: (size: number) => void,
}

interface IPaginationSizePrivateProps extends IConnectHocOutput, IComponentsHocOutput {
    listId?: string;
    list?: {
        page?: number
        pageSize?: number
        total?: number
    };
}

const defaultProps = {
    sizes: [30, 50, 100],
};

@connect()
@components('ui')
export default class PaginationSize extends React.PureComponent<IPaginationSizeProps & IPaginationSizePrivateProps> {

    static defaultProps = defaultProps;

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
                items={this.props.sizes.map(size => ({
                    size,
                    label: size,
                    isActive: _get(this.props, 'list.pageSize') === size
                }))}
                onSelect={this._onSelect}
            />
        );
    }

    _onSelect(value) {
        this.props.onChange(value);
    }

}
