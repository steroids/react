import * as React from 'react';
import {createPortal} from 'react-dom';
import {components} from '../../hoc';
import {IComponentsHocOutput} from '../../hoc/components';


@components('ui')
export default class Portal extends React.PureComponent<IComponentsHocOutput> {
    el: HTMLDivElement;

    constructor(props) {
        super(props);

        this.el = document.createElement('div');
        this.el.className = 'Portal';
    }

    componentDidMount() {
        document.body.appendChild(this.el);
        this.props.ui.setPortalElement(this.el);
    }

    componentWillUnmount() {
        this.props.ui.setPortalElement(null);
        document.body.removeChild(this.el);
    }

    render() {
        return createPortal(this.props.children, this.el);
    }
}
