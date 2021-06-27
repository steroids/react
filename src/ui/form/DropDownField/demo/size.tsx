import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * Sizes
 * @order 10
 * @col 6
 */
export default () => (
    <>
        <div className='row mb-4'>
            {Object.keys(sizes)
                .map(size => (
                    <div className='col' key={size}>
                        <DropDownField
                            label={size}
                            size={size}
                            items={items}
                        />
                    </div>
                ))}
        </div>
    </>
);
