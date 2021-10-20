import * as React from 'react';
import {Button} from '../../../../ui/form';
import Tooltip from '../Tooltip';

/**
 * Обычное использование Tooltip c 4-мя разными позициями и по-умолчанию включена видимость.
 * @order 1
 * @col 6
 */

export default () => (
    <>
        <div
            style={{
                display: 'flex',
                flexFlow: 'column',
                alignItems: 'center',
                gridGap: '15px',
                padding: '50px',
            }}
        >
            <Tooltip defaultVisible position='top' content='Всплывающая подсказка сверху.'>
                <div className='mx-3' style={{width: 'max-content'}}>
                    <Button className='mx-3' label='Show Tooltip on Top' />
                </div>
            </Tooltip>
            <Tooltip defaultVisible position='right' content='Всплывающая подсказка справа.'>
                <div className='mx-3' style={{width: 'max-content'}}>
                    <Button className='mx-3' label='Show Tooltip Right' />
                </div>
            </Tooltip>
            <Tooltip defaultVisible position='left' content='Всплывающая подсказка слева.'>
                <div className='mx-3' style={{width: 'max-content'}}>
                    <Button label='Show Tooltip Left' />
                </div>
            </Tooltip>
            <Tooltip defaultVisible position='bottom' content='Всплывающая подсказка снизу.'>
                <div className='mx-3' style={{width: 'max-content'}}>
                    <Button label='Show Tooltip Bottom' />
                </div>
            </Tooltip>
        </div>
    </>
);
