import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IEmptyProps {
    enable?: boolean,
    text?: string | React.ReactNode;
    className?: string;
    view?: CustomView,
}

export interface IEmptyViewProps {

}

interface IEmptyPrivateProps extends IComponentsHocOutput {

}

@components('ui')
export default class Empty extends React.PureComponent<IEmptyProps & IEmptyPrivateProps> {
    render() {
        const EmptyView = this.props.view || this.props.ui.getView('list.EmptyView');
        return (
            <EmptyView {...this.props} />
        );
    }
}
