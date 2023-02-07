import * as React from 'react';
import {Button} from '../../../form';
import useDispatch from '../../../../hooks/useDispatch';
import {showNotification} from '../../../../actions/notifications';

/**
 * Все позиции уведомлений
 * @order 3
 * @col 12
 */

const positions = {
    tr: 'top-right',
    tl: 'top-left',
    br: 'bottom-right',
    bl: 'bottom-left',
};

export default () => {
    const dispatch = useDispatch();
    return (
        <div style={{display: 'grid', gridAutoFlow: 'column', gridGap: '10px', justifyContent: 'center'}}>
            {Object.values(positions).map((position: string) => (
                <Button
                    key={position}
                    color='dark'
                    label={`Позиция ${position}`}
                    onClick={() => {
                        //TODO remove @ts-ignore
                        //@ts-ignore
                        dispatch(showNotification(position, 'success', {position, timeOut: 1000}));
                    }}
                />
            ))}
        </div>
    );
};
