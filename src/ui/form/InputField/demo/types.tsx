import * as React from 'react';

import InputField from '../InputField';

const types = {
    text: 'Text',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    hidden: 'Hidden',
};

/**
 * Types
 * @order 11
 * @col 12
 */
export default () => (
    <div className='row'>
        {Object.keys(types).map(type => (
            <div className='col' key={type}>
                <InputField label={type} type={type} />
            </div>
        ))}
    </div>
);
