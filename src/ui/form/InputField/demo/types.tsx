import * as React from 'react';

import InputField from '../InputField';

/**
 * InputField может задавать требуемое содержание по типу.
 * @order 9
 * @col 12
 */

const types = {
    text: 'Text',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
};

export default () => (
    <div className='row'>
        {Object.keys(types).map(type => (
            <div
                className='col'
                key={type}
            >
                <p>{type}</p>
                <InputField
                    label={type}
                    type={type}
                />
            </div>
        ))}
    </div>
);
