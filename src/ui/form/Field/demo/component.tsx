import * as React from 'react';
import Field from '../Field';
import DateField from '../../DateField';

/**
 * Field with component
 * @order 3
 * @col 6
 */
export default () => (
    <>
        <Field
            component={DateField}
            label='Date'
        />
    </>
);
