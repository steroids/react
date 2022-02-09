import * as React from 'react';
import {Header} from '../../../layout';
import SliderField from '../SliderField';

/**
 * Использования свойства onAfterChange для изминения значения счетчика после отпускания tip'а у слайдера.
 * @order 9
 * @col 6
 */

export default () => {
    const [counter, setCounter] = React.useState('0');
    return (
        <div style={{padding: '20px 30px'}}>
            <SliderField
                onAfterChange={value => setCounter(value)}
            />
            <div>
                <Header>
                    {__('Значение слайдера: {counter}', {counter})}
                </Header>
            </div>
        </div>
    );
};
