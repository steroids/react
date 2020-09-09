import * as React from 'react';

import Tooltip from '../Tooltip';
import {Button} from '@steroidsjs/core/ui/form';

export default () => (
    <>
        <div>
            <Tooltip defaultVisible position='leftBottom' content='Loooooong.....'>
                <Button style={{height: '100px'}} className='mx-3' label='Show Tooltip Right'/>
            </Tooltip>
            <Tooltip position='bottomLeft' content='Looooooooooong....'>
                <Button className='mx-3' label='Show Tooltip Top'/>
            </Tooltip>
            <Tooltip position='topRight' content='Looooooooooong....'>
                <Button className='mx-3' label='Show Tooltip Left'/>
            </Tooltip>
            <Tooltip defaultVisible position='rightTop' content='Очень большое сообщение....'>
                <Button style={{height: '150px'}}  label='Show Tooltip Bottom'/>
            </Tooltip>
        </div>
    </>
);