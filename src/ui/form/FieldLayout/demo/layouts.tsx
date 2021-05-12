import * as React from 'react';
import InputField from '../../InputField';

const layouts = {
    inline: 'Inline',
    default: 'Default',
    horizontal: 'Horizontal',
};

/**
 * Inline layout
 * @order 5
 * @col 12
 */
export default () => (
    <div className='row'>
        {Object.keys(layouts).map(layout => (
            <div className='col-12 mb-4' key={layout}>
                <InputField label={layouts[layout]} layout={layout} />
            </div>
        ))}
    </div>
);
