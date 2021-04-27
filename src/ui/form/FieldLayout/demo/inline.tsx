import * as React from 'react';
import InputField from '../../InputField';

/**
 * Inline layout
 * @order 5
 * @col 6
 */
export default () => (
    <>
        <div className='mb-2'>Inline (label is hide)</div>
        <InputField label='Inline' layout='inline' />
    </>
);
