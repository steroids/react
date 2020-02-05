import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

interface INavBarProps {
    className?: string;
    view?: any;
}

interface INavBarPrivateProps extends IComponentsHocOutput {

}

@components('ui')
export default class NavBar extends React.PureComponent<INavBarProps & INavBarPrivateProps> {

    render() {
        const NavBarView = this.props.view || this.props.ui.getView('nav.NavBarView');
        // TODO
        return (
            <NavBarView {...this.props}/>
        );
    }

}
