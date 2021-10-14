import * as React from 'react';
import Collapse from '../Collapse';
import CollapseItem from '../CollapseItem';

/**
 * Anonymous function every time you change state of Collapse
 * @order 8
 * @col 6
 */

export default () => {
    const [touches, setTouches] = React.useState<number>(-2);
    return (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '15px', minHeight: '225px'}}>
            <Collapse
                style={{backgroundColor: 'lavender'}}
                icon='plus'
                onChange={() => setTouches(e => e + 1)}
            >
                <CollapseItem>Custom icon</CollapseItem>
                <CollapseItem>Custom icon</CollapseItem>
                <CollapseItem>Custom icon</CollapseItem>
            </Collapse>
            <div>
                <p style={{backgroundColor: 'lavender'}}>
                    You touched collapse
                    {' '}
                    {touches}
                    {' '}
                    time
                </p>
            </div>
        </div>
    );
};
