import * as React from 'react';
import FileField from '../FileField';

/**
 * Базовый FileField
 * @order 1
 * @col 6
 */

export default () => (
    <div style={{display: 'grid', gridGap: '10px'}}>
        <FileField backendUrl='/api/v1/file-test' />
    </div>
);
