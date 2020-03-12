import * as React from 'react';
import _get from 'lodash-es/get';
import _has from 'lodash-es/has';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import _isString from 'lodash-es/isString';
import {components, connect} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {getNavItems} from '../../../reducers/navigation';

export interface INavItem {
    id?: number | string,
    label?: string | any,
    url?: string,
    onClick?: (...args: any[]) => any,
    className?: string,
    view?: any,
    visible?: boolean,
    content?: any,
    contentProps?: any
}

export interface INavProps {
    layout?: 'button' | 'icon' | 'link' | 'tabs' | 'navbar' | 'list' | string;
    items?: string | INavItem[];
    activeTab?: number | string;
    className?: string;
    view?: any;
    onChange?: (...args: any[]) => any;
}

export interface INavViewProps {
    onClick: (item: object, index: number) => void,
    items: (INavItem & {
        isActive: boolean,
    })[]
}

interface INavPrivateProps extends IComponentsHocOutput {
}

interface NavState {
    activeTab?: any,
    filter?: any
}

@connect(
    (state, props) => ({
        items: _isString(props.items)
            ? getNavItems(state, props.items)
            : props.items,
    })
)
@components('ui')
export default class Nav extends React.PureComponent<INavProps & INavPrivateProps, NavState> {
    static defaultProps = {
        layout: 'button'
    };

    constructor(props) {
        super(props);
        this._onClick = this._onClick.bind(this);
        this.state = {
            activeTab: this.props.activeTab || _get(this.props, 'items.0.id') || 0
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.activeTab !== nextProps.activeTab && nextProps.activeTab) {
            this.setState({
                activeTab: nextProps.activeTab
            });
        }
    }

    render() {
        const defaultViewMap = {
            button: 'nav.NavButtonView',
            icon: 'nav.NavIconView',
            link: 'nav.NavLinkView',
            tabs: 'nav.NavTabsView',
            navbar: 'nav.NavBarView',
            list: 'nav.NavListView'
        };
        const NavView = this.props.view || this.props.ui.getView(defaultViewMap[this.props.layout]);
        const items = this.props.items as INavItem[];
        return (
            <NavView
                {...this.props}
                onClick={this._onClick}
                items={items
                    .map((item, index) => ({
                        ...item,
                        isActive: _has(item, 'id')
                            ? this.state.activeTab === item.id
                            : this.state.activeTab === index
                    }))
                    .filter(item => item.visible !== false)
                }
            >
                {this.renderContent()}
            </NavView>
        );
    }

    renderContent() {
        const items = this.props.items as INavItem[];
        const activeItem = items.find((item, index) => {
            return this.state.activeTab === (_has(item, 'id') ? item.id : index);
        });
        if (!activeItem || !activeItem.content) {
            return null;
        }
        if (_isFunction(activeItem.content) || _isObject(activeItem.content)) {
            const ContentComponent = activeItem.content;
            return <ContentComponent {...activeItem} {...activeItem.contentProps} />;
        }
        return activeItem.content;
    }

    _onClick(item, index) {
        const activeTab = _has(item, 'id') ? item.id : index;
        this.setState({activeTab});
        if (this.props.onChange) {
            this.props.onChange(activeTab);
        }
    }
}
