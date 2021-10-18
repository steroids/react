import * as React from 'react';

import InputField from '../InputField';

/**
 * Types
 * @order 9
 * @col 12
 */

const types = {
    text: 'Text',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    hidden: 'Hidden',
};

export default () => (
    <div className='row'>
        {Object.keys(types).map(type => (
            <div className='col' key={type}>
                <InputField label={type} type={type} />
            </div>
        ))}
    </div>
);
