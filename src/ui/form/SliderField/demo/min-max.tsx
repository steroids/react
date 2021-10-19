import * as React from 'react';
import SliderField from '../SliderField';

/**
 * Установлены рамки минамльного и максимального значения.
 * @order 5
 * @col 4
 */

export default () => (
    <div style={{padding: '0 20px'}}>
        <SliderField label='With min and max values' min={10} max={30} />
    </div>
);
