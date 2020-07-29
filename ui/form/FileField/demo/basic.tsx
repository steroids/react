import * as React from 'react';

import FileField from '../FileField';

export default () => (
    <>
        <FileField
            backendUrl={'/api/v1/file-test'}
            label='File'
        />
    </>
);