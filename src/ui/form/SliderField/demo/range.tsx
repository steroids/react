import * as React from 'react';
import SliderField from '../SliderField';

/**
 * Использования режима промежутка с отметками.
 * @order 7
 * @col 4
 */

const marks = {
    '-10': '-10°C',
    0: <strong>0°C</strong>,
    26: '26°C',
    37: '37°C',
    50: '50°C',
    100: {
        style: {
            color: 'red',
        },
        label: <strong>100°C</strong>,
    },
};

export default () => (
    <div style={{padding: '20px 30px'}}>
        <SliderField marks={marks} isRange />
    </div>
);
