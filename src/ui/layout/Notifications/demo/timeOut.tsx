import * as React from 'react';
import {Button} from '../../../form';
import useDispatch from '../../../../hooks/useDispatch';
import {showNotification} from '../../../../actions/notifications';

/**
 * Время самостоятельного пропадания уведомления в милесекундах
 * @order 2
 * @col 6
 */

const times = {
    1: 1000,
    3: 3000,
    5: 5000,
    10: 10000,
};

export default () => {
    const dispatch = useDispatch();
    return (
        <div style={{display: 'flex', flexFlow: 'column'}}>
            {Object.values(times).map((time: number) => (
                <Button
                    key={time}
                    color='primary'
                    label={`Через ${time / 1000} секунд пропадет уведомление`}
                    onClick={() => {
                        dispatch(
                            //TODO remove @ts-ignore
                            //@ts-ignore
                            showNotification(
                                `${time / 1000} секунд`, 'info',
                                {position: 'bottom-right', timeOut: time},
                            ),
                        );
                    }}
                    style={{margin: '10px 0'}}
                />
            ))}
        </div>
    );
};
