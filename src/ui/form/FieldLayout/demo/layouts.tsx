import * as React from 'react';
import InputField from '../../InputField';
import FieldLayout from '../FieldLayout';

const layouts = {
    inline: 'Inline',
    default: 'Default',
    horizontal: 'Horizontal',
};

/**
 * По-умлочанию FieldLayout имеет 3 заданных ориентации.
 * @order 5
 * @col 12
 */

export default () => (
    <div style={{display: 'grid', gridGap: '10px'}}>
        {Object.keys(layouts).map(layout => (
            <FieldLayout className='col-12 mb-4' key={layout} layout={layout}>
                <InputField label={layouts[layout]} />
            </FieldLayout>
        ))}
    </div>
);
