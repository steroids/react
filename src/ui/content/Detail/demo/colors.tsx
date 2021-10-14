import {Card} from '@steroidsjs/core/ui/content';
import * as React from 'react';

const colors = {
    primary: 'primary',
    sd: 'secondary',
    sc: 'success',
    if: 'info',
    wr: 'warning',
    dn: 'danger',
    lg: 'light',
    dr: 'dark',
};

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

export default () => (
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {Object.values(colors).map(color => (
            <div style={{marginRight: '30px', marginBottom: '30px'}} key={color}>
                <>
                    <Card
                        style={{width: '320px'}}
                        header='Header'
                        title={capitalize(color) + ' card title'}
                        color={color}
                    >
                        Some quick example text to build on the card title and make up the bulk of the card's content.
                    </Card>
                </>
            </div>
        ))}
    </div>
);
