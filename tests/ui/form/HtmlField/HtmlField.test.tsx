import '@testing-library/jest-dom';
import HtmlFieldMockView from './HtmlFieldMockView';
import HtmlField from '../../../../src/ui/form/HtmlField';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('HtmlField tests', () => {
    const props = {
        view: HtmlFieldMockView,
    };

    const expectedHtmlFieldClass = 'HtmlFieldView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(HtmlField, props));
        const htmlField = getElementByClassName(container, expectedHtmlFieldClass);
        expect(htmlField).toBeInTheDocument();
    });
});
