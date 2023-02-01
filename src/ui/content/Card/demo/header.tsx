import * as React from 'react';
import {Button} from '../../../form';
import Card from '../Card';

/**
 * Header and footer
 * @order 3
 * @col 12
 */

const text = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.';

export default () => (
    <div style={{display: 'grid', gridAutoFlow: 'column', gridGap: '30px'}}>
        <Card
            title='Card title'
            header='Header'
        >
            {text}
            <Button>Button</Button>
        </Card>
        <Card
            title='Card title'
            footer='Footer'
        >
            {text}
            <Button>Button</Button>
        </Card>
        <Card
            title='Card title'
            header='Header'
            footer='Footer'
        >
            {text}
            <Button>Button</Button>
        </Card>
    </div>
);
