import * as React from 'react';
import Button from '../../form/Button';
import {IButtonProps, IButtonViewProps} from '../../form/Button/Button';

export interface ILinkProps extends IButtonProps {
    to?: string,
}

export interface ILinkViewProps extends IButtonViewProps {
}

export default class Link extends React.PureComponent<ILinkProps> {

    render() {
        return <Button link {...this.props} />;
    }

}
