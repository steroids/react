import React from 'react';

import Button from '../../form/Button';

export default class Link extends React.PureComponent {

    render() {
        return (
            <Button
                link
                {...this.props}
            />
        );
    }

}