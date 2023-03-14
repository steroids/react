import * as React from 'react';
import ProgressBar from '../ProgressBar';

/**
 * Свойство percent может задваться статично или динамически.
 * @order 2
 * @col 6
 */

export default () => {
    const [count, setCount] = React.useState<number>(0);
    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    if (count < 100) {
        setTimeout(() => setCount(e => e + getRandomInt(1, 10)), 1500);
    }

    return (
        <div style={{display: 'flex', gridGap: '10px', paddingRight: '10px'}}>
            <div style={{display: 'flex', gridGap: '10px'}}>
                <ProgressBar
                    percent={count}
                    size='small'
                    type='circle'
                    status={count >= 100 ? 'success' : 'normal'}
                />
                <ProgressBar
                    percent={10}
                    size='small'
                    type='circle'
                    status='exception'
                />
            </div>
            <div style={{maxWidth: '70%'}}>
                <ProgressBar
                    percent={10}
                    size='small'
                    status='exception'
                />
                <ProgressBar
                    percent={count}
                    size='small'
                    status={count >= 100 ? 'success' : 'normal'}
                />
            </div>
        </div>
    );
};
