import * as React from 'react';
import AutoCompleteField from '../AutoCompleteField';
import {items} from './basic';

/**
 * По-умлочанию AutoCompleteField имеет 3 заданных размера.
 * @order 6
 * @col 12
 */

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

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
