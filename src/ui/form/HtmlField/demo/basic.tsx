import * as React from 'react';
import HtmlField from '../HtmlField';

export default () => (
    <>
        <HtmlField
            label='Article content'
            uploadUrl='/api/v1/file-test'
            uploadImagesProcessor='original'
        />
    </>
);
