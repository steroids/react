import * as React from 'react';
import SliderField from '../SliderField';

/**
 * Set min and max values
 * @order 6
 * @col 4
 */
export default () => (
    <>
        <SliderField label='With min and max values' min={10} max={30} />
    </>
);
