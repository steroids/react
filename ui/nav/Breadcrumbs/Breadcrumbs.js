import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {components} from '../../../hoc';
import {getBreadcrumbs} from '../../../reducers/navigation';

@connect(
    (state, props) => ({
        items: props.items || getBreadcrumbs(state, props.pageId, props.params),
    })
)
@components('ui')
export default class Breadcrumbs extends React.PureComponent {

    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.object),
        params: PropTypes.string,
        pageId: PropTypes.string,
        pageTitle: PropTypes.string,
    };

    static defaultProps = {
        items: [],
    };

    render() {
        const BreadcrumbsView = this.props.view || this.props.ui.getView('nav.BreadcrumbsView');
        return (
            <BreadcrumbsView {...this.props} />
        );
    }
}
