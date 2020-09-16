import * as React from 'react';

import Tooltip from '../Tooltip';
import {Button} from '@steroidsjs/core/ui/form';

export default () => (
    <>
        <div>
            <Tooltip position='left' content='Всплывающая подсказка.'>
                <Button className='mx-3' label='Show Tooltip Left'/>
            </Tooltip>
            <Tooltip defaultVisible position='top' content='Всплывающая подсказка.'>
                <Button className='mx-3' label='Show Tooltip on Top'/>
            </Tooltip>
            <Tooltip defaultVisible position='bottom' content='Всплывающая подсказка.'>
                <Button label='Show Tooltip Bottom'/>
            </Tooltip>
            <Tooltip position='right' content='Всплывающая подсказка.'>
                <Button className='mx-3' label='Show Tooltip Right'/>
            </Tooltip>
        </div>
    </>
);