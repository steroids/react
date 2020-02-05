import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

interface ILoaderProps {
    view?: any;
}

interface ILoaderPrivateProps extends IComponentsHocOutput {

}

@components('ui')
export default class Loader extends React.PureComponent<ILoaderProps & ILoaderPrivateProps> {

    render() {
        const LoaderView = this.props.view || this.props.ui.getView('layout.LoaderView');
        return <LoaderView {...this.props} />;
    }

}
