import * as React from 'react';

import Button from '../Button';

/**
 * Disabled
 * @order 4
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <Button disabled>
                    Disabled
                </Button>
            </>
        );
    }
}
