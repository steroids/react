import * as React from 'react';
import HtmlField from '../HtmlField';

/**
 * Обычный пример использования HtmlField.
 * @order 1
 * @col 12
 */

export default () => (
    <>
        <HtmlField
            label='Article content'
            uploadUrl='/api/v1/file-test'
            uploadImagesProcessor='original'
        />
    </>
);
