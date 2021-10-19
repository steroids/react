import * as React from 'react';
import SliderField from '../SliderField';

/**
 * Выключенный или недоступный для использования.
 * @order 2
 * @col 4
 */

export default () => (
    <div style={{padding: '0 20px'}}>
        <SliderField label='Disabled' disabled />
    </div>
);
