import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import HtmlField from '../../../../src/ui/form/HtmlField';
import HtmlFieldMockView from './HtmlFieldMockView';

describe('HtmlField tests', () => {
    const props = {
        view: HtmlFieldMockView,
    };

    const expectedHtmlFieldClass = 'HtmlFieldView';

    it('should be in the document', async () => {
        const {container} = render(JSXWrapper(HtmlField, props));

        expect(screen.getByText('Загрузка...')).toBeInTheDocument();

        await waitFor(() => {
            const htmlField = getElementByClassName(container, expectedHtmlFieldClass);

            expect(htmlField).toBeInTheDocument();
        });
    });
});
