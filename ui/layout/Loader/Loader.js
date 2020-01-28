import React from 'react';
import {components} from '../../../hoc';

@components('ui')
export default class Loader extends React.PureComponent {

    render() {
        const LoaderView = this.props.view || this.props.ui.getView('layout.LoaderView');
        return (
            <LoaderView {...this.props} />
        );
    }
}
