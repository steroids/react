import * as React from 'react';
import {connect} from 'react-redux';
import {components} from '../../../hoc';
import {getBreadcrumbs} from '../../../reducers/navigation';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IComponentsHocOutput} from '../../../hoc/components';

interface IBreadcrumbsProps {
    items?: any[];
    params?: string;
    pageId?: string;
    pageTitle?: string;
    view?: any;
}

interface IBreadcrumbsPrivateProps extends IConnectHocOutput, IComponentsHocOutput {
}

@connect((state, props) => ({
    items: props.items || getBreadcrumbs(state, props.pageId, props.params)
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
