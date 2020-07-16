import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IBooleanFormatterProps {
    value?: string | number | boolean;
    view?: CustomView;
}

@components('ui')
export default class BooleanFormatter extends React.Component<IBooleanFormatterProps & IComponentsHocOutput> {
    render() {
        const BooleanFormatterView = this.props.view || this.props.ui.getView('format.BooleanFormatterView');
        return <BooleanFormatterView
            value={this.props.value}
        />;
    }
}
