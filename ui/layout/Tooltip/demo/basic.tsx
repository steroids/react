import * as React from 'react';

import {Button} from '@steroidsjs/core/ui/form';
import Tooltip from '../Tooltip';

export default () => (
    <>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Tooltip position='left' content='Всплывающая подсказка.'>
                <div className='mx-3' style={{width: 'max-content'}}>
                    <Button label='Show Tooltip Left' />
                </div>
            </Tooltip>
            <Tooltip defaultVisible position='top' content='Всплывающая подсказка.'>
                <div className='mx-3' style={{width: 'max-content'}}>
                    <Button className='mx-3' label='Show Tooltip on Top' />
                </div>
            </Tooltip>
            <Tooltip defaultVisible position='bottom' content='Всплывающая подсказка.'>
                <div className='mx-3' style={{width: 'max-content'}}>
                    <Button label='Show Tooltip Bottom' />
                </div>
            </Tooltip>
            <Tooltip position='right' content='Всплывающая подсказка.'>
                <div className='mx-3' style={{width: 'max-content'}}>
                    <Button className='mx-3' label='Show Tooltip Right' />
                </div>
            </Tooltip>
        </div>
    </>
);
