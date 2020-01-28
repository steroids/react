import React from 'react';
import PropTypes from 'prop-types';

import {components} from '../../../hoc';

@components('ui')
export default class Empty extends React.PureComponent {

    static propTypes = {
        text: PropTypes.string,
        className: PropTypes.string,
        view: PropTypes.elementType,
    };

    render() {
        const EmptyView = this.props.view || this.props.ui.getView('list.EmptyView');
        return (
            <EmptyView
                {...this.props}
            />
        );
    }

}
