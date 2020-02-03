import * as React from 'react';
import {connect} from 'react-redux';
import {components} from '../../../hoc';
import {getBreadcrumbs} from '../../../reducers/navigation';

interface IBreadcrumbsProps {
    items?: any[];
    params?: string;
    pageId?: string;
    pageTitle?: string;
    getView?: any;
    ui?: any;
    view?: any;
}

@connect((state, props) => ({
    items: props.items || getBreadcrumbs(state, props.pageId, props.params)
}))
@components('ui')
export default class Breadcrumbs extends React.PureComponent<IBreadcrumbsProps,
    {}> {
    static defaultProps = {
        items: []
    };

    render() {
        const BreadcrumbsView =
            this.props.view || this.props.ui.getView('nav.BreadcrumbsView');
        return <BreadcrumbsView {...this.props} />;
    }
}
