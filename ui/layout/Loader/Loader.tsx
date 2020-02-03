import * as React from 'react';
import {components} from '../../../hoc';

interface ILoaderProps {
    getView?: any;
    ui?: any;
    view?: any;
}

@components('ui')
export default class Loader extends React.PureComponent<ILoaderProps, {}> {
    render() {
        const LoaderView =
            this.props.view || this.props.ui.getView('layout.LoaderView');
        return <LoaderView {...this.props} />;
    }
}
