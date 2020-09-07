import * as React from 'react';
import {createPortal} from 'react-dom';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

@components('ui')
export default class TooltipPortal extends React.PureComponent<IComponentsHocOutput>{

    componentDidMount() {
        if (!this.props.ui.getPortalElement()) {
            throw new Error('Not found UI Portal container. Please set <Portal/> in layout.')
        }
    }

    render() {
        return createPortal(this.props.children, this.props.ui.getPortalElement());
    }
}
