import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import {Text} from '../../../../src/ui/typography';
import TextMockView from './TextMockView';
import {getElementByTag, JSXWrapper} from '../../../helpers';

describe('Text tests', () => {
    const requiredPropsForTest = {
        testId: 'text-test',
        view: TextMockView,
    };

    const props = {
        ...requiredPropsForTest,
        type: 'body',
        content: 'Text test',
        color: 'primary',
        className: 'testClass',
        style: {marginBottom: '70px'},
    };

    const expectedTextClass = 'TextView';
    const wrapper = JSXWrapper(Text, props);

    it('should be in the document and have classes', () => {
        const {getByTestId} = render(wrapper);
        const text = getByTestId(props.testId);

        expect(text).toBeInTheDocument();
        expect(text).toHaveClass(expectedTextClass);
        expect(text).toHaveClass(props.className);
    });

    it('should have right color, type and external className', () => {
        const {getByTestId} = render(wrapper);
        const text = getByTestId(props.testId);

        expect(text).toHaveClass(`${expectedTextClass}_color_primary`);
        expect(text).toHaveClass(`${expectedTextClass}_type_body`);
    });

    it('should have correct content', () => {
        const {getByText} = render(wrapper);
        const content = getByText(props.content);

        expect(content).toBeInTheDocument();
    });

    it('should have correct html tag', () => {
        const {container} = render(JSXWrapper(Text, props));
        const expectedHtmlTag = 'p';
        const text = getElementByTag(container, expectedHtmlTag);
        expect(text).toBeInTheDocument();
    });

    it('without some props, should use default html tag', () => {
        const {container} = render(JSXWrapper(Text, requiredPropsForTest));
        const expectedHtmlTag = 'p';
        const text = getElementByTag(container, expectedHtmlTag);
        expect(text).toBeInTheDocument();
    });

    it('should have external html tag', () => {
        const tag = 'span';
        const {container} = render(JSXWrapper(Text, {
            ...props,
            tag,
        }));

        const span = getElementByTag(container, tag);
        expect(span).toBeInTheDocument();
    });

    it('should have children', () => {
        const children = 'children';
        const {getByTestId} = render(JSXWrapper(Text, {
            ...props,
            children,
        }));

        const text = getByTestId(props.testId);
        expect(text).toHaveTextContent(children);
    });

    it('should have right style', () => {
        const {getByTestId} = render(wrapper);
        const text = getByTestId(props.testId);

        expect(text).toHaveStyle(props.style);
    });
});
