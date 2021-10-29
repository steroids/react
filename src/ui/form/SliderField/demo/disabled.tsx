import * as React from 'react';
import SliderField from '../SliderField';

/**
 * Выключенный или недоступный для использования.
 * @order 2
 * @col 4
 */

export default () => (
    <div style={{padding: '20px 30px'}}>
        <SliderField label='Disabled' disabled />
    </div>
);
