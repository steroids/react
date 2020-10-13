import * as React from 'react';

import FileDragField from '../FileDragField';

export default () => (
    <>
        <FileDragField
            backendUrl={'/api/v1/file-test'}
            label='File'
        />
    </>
);
