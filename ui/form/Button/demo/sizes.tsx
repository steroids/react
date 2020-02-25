import * as React from 'react';

import Button from '../Button';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * Sizes
 * @order 2
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                {Object.keys(sizes).map(size => (
                    <Button
                        key={size}
                        size={size}
                        className='float-left mr-2'
                    >
                        {sizes[size]}
                    </Button>
                ))}
            </>
        );
    }
}
