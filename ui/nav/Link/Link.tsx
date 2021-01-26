import * as React from 'react';
import Button from '../../form/Button';
import {IButtonProps, IButtonViewProps} from '../../form/Button/Button';

export interface ILinkProps extends IButtonProps {
    to?: string,
    [key: string]: any,
}

export interface ILinkViewProps extends IButtonViewProps {
}

export default class Link extends React.PureComponent<ILinkProps> {

    render() {
        return (
            <Button
                tag='a'
                link
                {...this.props}
                formId={false}
            />
        );
    }

}
