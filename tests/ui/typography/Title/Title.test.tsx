import '@testing-library/jest-dom';
import {Title} from '../../../../src/ui/typography';
import TitleMockView from './TitleMockView';
import {getElementByTag, JSXWrapper, render} from '../../../helpers';

describe('Title tests', () => {
    const requiredPropsForTest = {
        testId: 'title-test',
        view: TitleMockView,
    };

    const props = {
        ...requiredPropsForTest,
        type: 'h1',
        content: 'Title test',
        color: 'primary',
        className: 'testClass',
        style: {marginBottom: '70px'},
    };

    const expectedTitleClass = 'TitleView';
    const wrapper = JSXWrapper(Title, props);

    it('should be in the document and have classes', () => {
        const {getByTestId} = render(wrapper);
        const title = getByTestId(props.testId);

        expect(title).toBeInTheDocument();
        expect(title).toHaveClass(expectedTitleClass);
        expect(title).toHaveClass(props.className);
    });

    it('should have right color, type', () => {
        const {getByTestId} = render(wrapper);
        const title = getByTestId(props.testId);

        expect(title).toHaveClass(`${expectedTitleClass}_color_primary`);
        expect(title).toHaveClass(`${expectedTitleClass}_type_h1`);
    });

    it('should have correct content', () => {
        const {getByText} = render(wrapper);
        const content = getByText(props.content);

        expect(content).toBeInTheDocument();
    });

    it('should have correct html tag', () => {
        const {container} = render(JSXWrapper(Title, props));
        const expectedHtmlTag = 'h1';
        const title = getElementByTag(container, expectedHtmlTag);
        expect(title).toBeInTheDocument();
    });

    it('without some props, should use default html tag', () => {
        const {container} = render(JSXWrapper(Title, requiredPropsForTest));
        const expectedHtmlTag = 'h2';
        const title = getElementByTag(container, expectedHtmlTag);
        expect(title).toBeInTheDocument();
    });

    it('should have external html tag', () => {
        const tag = 'h5';
        const {container} = render(JSXWrapper(Title, {
            ...props,
            tag,
        }));

        const title = getElementByTag(container, tag);
        expect(title).toBeInTheDocument();
    });

    it('should have children', () => {
        const children = 'children';
        const {getByTestId} = render(JSXWrapper(Title, {
            ...props,
            children,
        }));

        const title = getByTestId(props.testId);
        expect(title).toHaveTextContent(children);
    });

    it('should have right style', () => {
        const {getByTestId} = render(wrapper);
        const title = getByTestId(props.testId);

        expect(title).toHaveStyle(props.style);
    });
});
