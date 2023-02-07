import * as React from 'react';
import {Button} from '../../../form';
import Card from '../Card';

/**
 * Titles, text, and links
 * @order 2
 * @col 4
 */

const text = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.';

export default () => (
    <>
        <Card title='Card title'>
            {text}
            <div style={{display: 'flex', gridGap: '16px', padding: 0}}>
                <Button link>Link</Button>
                <Button link>Another link</Button>
            </div>
        </Card>
    </>
);
