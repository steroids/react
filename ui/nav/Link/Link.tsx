import * as React from 'react';
import Button from '../../form/Button';
import {IButtonProps} from '../../form/Button/Button';

interface ILinkProps extends IButtonProps {

}

export default class Link extends React.PureComponent<ILinkProps> {

    render() {
        return <Button link {...this.props} />;
    }

}
