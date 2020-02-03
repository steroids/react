import * as React from 'react';
import {components} from '../../../hoc';

interface IEmptyProps {
    text?: string;
    className?: string;
    view?: any;
    getView?: any;
    ui?: any;
}

@components('ui')
export default class Empty extends React.PureComponent<IEmptyProps, {}> {
    render() {
        const EmptyView =
            this.props.view || this.props.ui.getView('list.EmptyView');
        return <EmptyView {...this.props} />;
    }
}
