import {useComponents} from '../../../hooks';
import {INavProps} from '../../nav/Nav/Nav';

export interface IHeaderProps {
    className?: CssClassName;
    view?: any;
    logo?: {
        title: string,
        linkProps?: Record<string, unknown>,
        icon?: string | any,
        className?: CssClassName,
    };
    nav?: INavProps;

    /**
     * Размер
     */
    size?: Size,

    /**
     * Темная тема
     */
    dark?: boolean,

    [key: string]: any;
}

export type IHeaderViewProps = IHeaderProps

export default function Header(props:IHeaderProps): JSX.Element {
    return useComponents().ui.renderView(props.view || 'layout.HeaderView', props);
}
