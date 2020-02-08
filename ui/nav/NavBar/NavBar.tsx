import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IBemHocOutput} from '../../../hoc/bem';

export interface INavBarProps {
    className?: string;
    view?: any;
    logo?: {
        title: string,
        linkProps?: object,
        imageUrl?: string,
        className?: string,
    }
}

export interface INavBarViewProps extends INavBarProps, IBemHocOutput {
}

interface INavBarPrivateProps extends IComponentsHocOutput {

}

@components('ui')
export default class NavBar extends React.PureComponent<INavBarProps & INavBarPrivateProps> {

    render() {
        const NavBarView = this.props.view || this.props.ui.getView('nav.NavBarView');
        return (
            <NavBarView {...this.props}/>
        );
    }

}
