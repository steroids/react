import * as React from 'react';
import SliderField from '../SliderField';

/**
 * Обработка ошибок.
 * @order 4
 * @col 4
 */

export default () => (
    <div style={{padding: '0 20px'}}>
        <SliderField label='Errors' errors={['Error 1 text', 'Error 2 text']} layout />
    </div>
);
