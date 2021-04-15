import * as React from 'react';

import Button from '../Button';

const layouts = {
    default: 'Default',
    horizontal: 'Horizontal',
    inline: 'Inline',
};

/**
 * Button with different layouts
 * @order 8
 * @col 4
 */
export default () => (
    <>
        {Object.keys(layouts).map(layout => (
            <Button
                key={layout}
                layout={layout}
                label={layouts[layout]}
            />
        ))}
    </>
);
