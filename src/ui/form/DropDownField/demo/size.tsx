import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <>
        <div className='row mb-4'>
            {Object.keys(sizes)
                .map(size => (
                    <div className="col" key={size}>
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
