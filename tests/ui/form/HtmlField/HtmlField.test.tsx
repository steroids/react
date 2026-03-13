import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';

import HtmlFieldMockView from './HtmlFieldMockView';
import HtmlField from '../../../../src/ui/form/HtmlField';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('HtmlField tests', () => {
    const props = {
        view: HtmlFieldMockView,
    };

    const expectedHtmlFieldClass = 'HtmlFieldView';

    it('should be in the document', async () => {
        const {container} = render(JSXWrapper(HtmlField, props));

        await waitFor(() => {
            const htmlField = getElementByClassName(container, expectedHtmlFieldClass);

            expect(htmlField).toBeInTheDocument();
        });
    });
});
