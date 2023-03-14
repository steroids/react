import * as React from 'react';
import Card from '../Card';

/**
 * Color types
 * @order 6
 * @col 12
 */

const colors = {
    pr: 'primary',
    sd: 'secondary',
    sc: 'success',
    if: 'info',
    wr: 'warning',
    dn: 'danger',
    lg: 'light',
    dr: 'dark',
};

const text = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.';

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

export default () => (
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {Object.values(colors).map(color => (
            <div
                style={{marginRight: '30px', marginBottom: '30px'}}
                key={color}
            >
                <>
                    <Card
                        style={{width: '320px'}}
                        header='Header'
                        title={capitalize(color) + ' card title'}
                        color={color}
                    >
                        {text}
                    </Card>
                </>
            </div>
        ))}
    </div>
);
