import * as React from 'react';

import Button from '../Button';

/**
 * Block
 * @order 3
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <Button
                    block
                    label={__('Block')}
                />
            </>
        );
    }
}
