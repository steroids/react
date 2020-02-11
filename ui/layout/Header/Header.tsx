import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IBemHocOutput} from '../../../hoc/bem';
import {IConnectHocOutput} from '../../../hoc/connect';
import {INavProps} from '../../nav/Nav/Nav';

export interface IHeaderProps {
    className?: string;
    view?: any;
    logo?: {
        title: string,
        linkProps?: object,
        logoUrl?: string | any,
        className?: string,
    };
    nav?: INavProps;
}

export interface IHeaderViewProps extends IHeaderProps, IBemHocOutput {
}

interface IHeaderPrivateProps extends IConnectHocOutput, IComponentsHocOutput {

}

@components('ui')
export default class Header extends React.PureComponent<IHeaderProps & IHeaderPrivateProps> {

    render() {
        const HeaderView = this.props.view || this.props.ui.getView('layout.HeaderView');
        return (
            <HeaderView {...this.props}/>
        );
    }

}
