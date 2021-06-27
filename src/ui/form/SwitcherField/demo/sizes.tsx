import * as React from 'react';
import SwitcherField from '../SwitcherField';
import {items} from './basic';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * Sizes
 * @order 5
 * @col 12
 */
export default () => (
    <div className='row'>
        {Object.keys(sizes)
            .map(size => (
                <div className='col' key={size}>
                    <SwitcherField
                        label={sizes[size]}
                        items={items}
                        key={size}
                        size={size}
                        className='float-left mr-2'
                    />
                </div>
            ))}
    </div>
);
