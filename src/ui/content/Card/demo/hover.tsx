import * as React from 'react';
import {Button} from '../../../form';
import Card from '../Card';

/**
 * Hover image
 * @order 1
 * @col 8
 */

const text = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.';

export default () => (
    <div style={{display: 'flex', gridGap: '15px'}}>
        <Card
            title='Card title'
            cover='https://i.ibb.co/rK9tsnJ/swamp.png'
        >
            {text}
            <Button>Button</Button>
        </Card>
        <Card
            title='Card title'
            cover='https://i.ibb.co/rK9tsnJ/swamp.png'
        >
            {text}
        </Card>
    </div>
);
