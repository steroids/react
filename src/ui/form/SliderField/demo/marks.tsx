import * as React from 'react';
import SliderField from '../SliderField';

/**
 * Обычный пример использования режима промежутка вместе с заданными отметками и возможность выбирать только по меткам.
 * @order 7
 * @col 4
 */

export default () => (
    <div style={{padding: '20px 30px'}}>
        <SliderField
            min={20}
            defaultValue={20}
            marks={{ 20: 20, 40: 40, 100: 100 }}
            step={null}
        />
    </div>
);
