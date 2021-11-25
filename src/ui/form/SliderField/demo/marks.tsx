import * as React from 'react';
import SliderField from '../SliderField';

/**
 * Обычный пример задания отметок со описанием по всей длине слайдера.
 * @order 7
 * @col 4
 */

const marks = {
    0: <strong>0°C</strong>,
    26: '26°C',
    37: '37°C',
    50: '50°C',
    80: {
        style: {
            color: 'red',
        },
        label: <strong>80°C</strong>,
    },
};

export default () => (
    <div style={{padding: '20px 30px'}}>
        <SliderField
            min={-10}
            max={80}
            marks={marks}
        />
    </div>
);
