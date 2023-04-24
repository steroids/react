import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import HtmlField from '../../../../src/ui/form/HtmlField';
import HtmlFieldMockView from './HtmlFieldMockView';

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
