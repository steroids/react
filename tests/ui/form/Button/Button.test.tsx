import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import Button, {IButtonProps} from '../../../../src/ui/form/Button/Button';
import ButtonMockView from './ButtonMockView';
import {getElementByClassName, getElementByTag, JSXWrapper, render} from '../../../helpers';

describe('Button tests', () => {
    const props: IButtonProps = {
        view: ButtonMockView,
    };

    const expectedButtonClass = 'ButtonView';

    it('button should be in the document', () => {
        const {container} = render(JSXWrapper(Button, props));
        const button = getElementByClassName(container, expectedButtonClass);

        expect(button).toBeInTheDocument();
    });

    it('should have right label', () => {
        const label = 'test-label';

        const {getByText} = render(JSXWrapper(Button, {
            ...props,
            label,
        }));

        expect(getByText(label)).toBeInTheDocument();
    });

    it('should have right color, outline, loading, fontThickness, size', () => {
        const additionalProps: IButtonProps = {
            color: 'info',
            outline: true,
            isLoading: true,
            size: 'md',
        };

        const {container} = render(JSXWrapper(Button, {
            ...props,
            ...additionalProps,
        }));
        const button = getElementByClassName(container, expectedButtonClass);

        expect(button).toHaveClass(`${expectedButtonClass}_outline_${additionalProps.color}`);
        expect(button).toHaveClass(`${expectedButtonClass}_loading`);
        expect(button).toHaveClass(`${expectedButtonClass}_size_${additionalProps.size}`);
    });

    it('should have disabled', () => {
        const disabled = 'disabled';

        const {container} = render(JSXWrapper(Button, {
            ...props,
            [disabled]: true,
        }));

        const button = getElementByClassName(container, expectedButtonClass);

        expect(button).toHaveClass(`${expectedButtonClass}_${disabled}`);
    });

    it('should have hint', () => {
        const hint = 'test-hint';

        const {container} = render(JSXWrapper(Button, {
            ...props,
            hint,
        }));

        const button = getElementByClassName(container, expectedButtonClass);

        expect(button).toHaveAttribute('title', hint);
    });

    it('should have failed', () => {
        const {container} = render(JSXWrapper(Button, {
            ...props,
            isFailed: true,
        }));

        const button = getElementByClassName(container, expectedButtonClass);

        expect(button).toHaveClass(`${expectedButtonClass}_failed`);
    });

    it('should be block and link', () => {
        const {container} = render(JSXWrapper(Button, {
            ...props,
            block: true,
            link: true,
        }));

        const link = getElementByClassName(container, expectedButtonClass);

        expect(link).toHaveAttribute('href', '#');
        expect(link).toHaveClass('btn-link');
        expect(link).toHaveClass('btn-block');
    });

    it('should be tag', () => {
        const {container} = render(JSXWrapper(Button, {
            ...props,
            tag: 'a',
        }));

        const tag = getElementByTag(container, 'a');

        expect(tag).toBeInTheDocument();
    });

    it('should have badge', () => {
        const badgeContent = 2;

        const {container} = render(JSXWrapper(Button, {
            ...props,
            badge: badgeContent,
        }));

        const badge = getElementByClassName(container, `${expectedButtonClass}__badge`);

        expect(badge).toBeInTheDocument();
        expect(badge).toHaveTextContent(badgeContent.toString());
    });

    it('should have external styles and className', () => {
        const externalClassName = 'test-button';

        const externalStyle = {
            width: '30px',
        };

        const {container} = render(JSXWrapper(Button, {
            ...props,
            style: externalStyle,
            className: externalClassName,
        }));

        const button = getElementByClassName(container, expectedButtonClass);

        expect(button).toHaveStyle(externalStyle);
        expect(button).toHaveClass(externalClassName);
    });

    it('default click', () => {
        const mockedOnClick = jest.fn();

        const {container} = render(JSXWrapper(Button, {
            ...props,
            onClick: mockedOnClick,
        }));

        const button = getElementByTag(container, 'button');
        const expectedClickCallCount = 1;
        fireEvent.click(button);

        expect(mockedOnClick.mock.calls.length).toBe(expectedClickCallCount);
    });

    //Todo confirm action
});
