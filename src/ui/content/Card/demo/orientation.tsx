import * as React from 'react';
import Card from '../Card';

/**
 * Card with different orientation
 * @order 5
 * @col 12
 */

const orientations = {
    vtl: 'vertical',
    vr: 'vertical-reverse',
    hz: 'horizontal',
};

const text = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.';

export default () => (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 2fr'}}>
        {Object.values(orientations).map(orientation => (
            <div style={{marginRight: '30px'}} key={orientation}>
                <>
                    <Card
                        title='Card title'
                        orientation={orientation}
                        cover='https://i.ibb.co/rK9tsnJ/swamp.png'
                    >
                        {text}
                        <p style={{color: '#C0C0C0', fontSize: '12px'}}>Last updated 3 mins ago</p>
                    </Card>
                </>
            </div>
        ))}
    </div>
);
