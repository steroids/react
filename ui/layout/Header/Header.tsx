import * as React from 'react';
import {components, theme} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IBemHocOutput} from '../../../hoc/bem';
import {IConnectHocOutput} from '../../../hoc/connect';
import {INavProps} from '../../nav/Nav/Nav';
import {IThemeHocInput} from '../../../hoc/theme';

export interface IHeaderProps extends IThemeHocInput {
    className?: CssClassName;
    view?: any;
    logo?: {
        title: string,
        linkProps?: object,
        icon?: string | any,
        className?: CssClassName,
    };
    nav?: INavProps;
    [key: string]: any;
}

export interface IHeaderViewProps extends IHeaderProps, IBemHocOutput {
}

interface IHeaderPrivateProps extends IConnectHocOutput, IComponentsHocOutput {

}

@theme()
@components('ui')
export default class Header extends React.PureComponent<IHeaderProps & IHeaderPrivateProps> {

    render() {
        const HeaderView = this.props.view || this.props.ui.getView('layout.HeaderView');
        return (
            <HeaderView {...this.props}/>
        );
    }

}
