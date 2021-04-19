import * as React from 'react';
import AutoCompleteField from '../AutoCompleteField';
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
        {Object.keys(sizes).map(size => (
            <div className='col' key={size}>
                <AutoCompleteField
                    label={size}
                    size={size}
                    items={items}
                />
            </div>
        ))}
    </div>
);
