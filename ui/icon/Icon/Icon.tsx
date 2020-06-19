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

export interface IIconViewProps {
    /**
     * @example require('icon.png'), <svg .../>, 'https://<site-name>/icon.png
     */
    icon: number | React.ReactNode | string,
    [key: string]: any
}

@components('ui')
export default class Icon extends React.PureComponent<IIconProps> {
    getIcon() {
        return this.props.ui.icons
            ? this.props.ui.icons[this.props.name]
            : null;
    }

    render() {
        const IconView = this.props.view || this.props.ui.getView('icon.IconView');
        return (
            <IconView
                {...this.props}
                icon={this.getIcon()}
            />
        )
    }
}