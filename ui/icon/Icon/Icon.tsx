import React from 'react';

import {components} from "../../../hoc";
import {IComponentsHocOutput} from "../../../hoc/components";

interface IIconProps extends IComponentsHocOutput {
    /**
     * Название иконки. Импорт иконок происходит на старте приложения.
     */
    name?: string,
    [key: string]: any
}

interface IIconViewProps {
    /**
     * @example require('icon.png'), <svg .../>, 'https://<site-name>/icon.png
     */
    icon: number | React.ReactNode | string,
    [key: string]: any
}

@components('ui')
export default class Icon extends React.PureComponent<IIconProps> {
    getIcon() {
        console.log("UI ICONS", this.props.ui.icons);
        return this.props.ui.icons
            ? this.props.ui.icons[this.props.name]
            : null;
    }

    render() {
        const IconView = this.props.view || this.props.ui.getView('icon.IconView');
        return (
            <IconView icon={this.getIcon()}/>
        )
    }
}