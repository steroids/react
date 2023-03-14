import * as React from 'react';
import TimeField from '../TimeField';

/**
 * После выбора времени при наведении на иконку иконка меняется на кнопку для очищении значения.
 * @order 8
 * @col 3
 */

export default () => (
    <>
        <TimeField
            label='showRemove'
            showRemove
        />
    </>
);
