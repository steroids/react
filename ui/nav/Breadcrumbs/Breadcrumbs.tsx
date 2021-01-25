import * as React from 'react';
import {connect} from 'react-redux';
import {components} from '../../../hoc';
import {getRouteBreadcrumbs} from '../../../reducers/router';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IBreadcrumbsProps {
    items?: any[];
    params?: string;
    pageId?: string;
    pageTitle?: string;
    view?: any;
    [key: string]: any;
}

export interface IBreadcrumbsViewProps extends IBreadcrumbsProps{

}

interface IBreadcrumbsPrivateProps extends IConnectHocOutput, IComponentsHocOutput {
}

@connect((state, props) => ({
    items: props.items || getRouteBreadcrumbs(state, props.pageId) // TODO router breadcrumbs
}))
@components('ui')
export default class Breadcrumbs extends React.PureComponent<IBreadcrumbsProps & IBreadcrumbsPrivateProps> {

    static defaultProps = {
        items: []
    };

    render() {
        const BreadcrumbsView =
            this.props.view || this.props.ui.getView('nav.BreadcrumbsView');
        return <BreadcrumbsView {...this.props} />;
    }

}
