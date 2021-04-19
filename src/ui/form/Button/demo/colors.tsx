import * as React from 'react';

import Button from '../Button';

const colors = {
    primary: 'Primary',
    secondary: 'Secondary',
    success: 'Success',
    danger: 'Danger',
    warning: 'Warning',
    info: 'Info',
    light: 'Light',
    dark: 'Dark',
};

/**
 * Colors
 * @order 1
 * @col 8
 */
export default () => (
    <>
        {Object.keys(colors).map(color => (
            <Button
                key={color}
                color={color}
                label={colors[color]}
            />
        ))}
        <br />
        {Object.keys(colors).map(color => (
            <Button
                key={color}
                color={color}
                label={colors[color]}
                outline
            />
        ))}
    </>
);
