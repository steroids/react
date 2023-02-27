import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';

import {render} from '../../../customRender';
import Button, {IButtonProps} from '../../../../src/ui/form/Button/Button';
import ButtonMockView from './ButtonMockView';

describe('Button tests', () => {
    const props : IButtonProps = {
        view: ButtonMockView,
    };

    function JSXWrapper(additionalProps: IButtonProps | null = null) {
        return (
            <div>
                <Button
                    {...props}
                    {...additionalProps}
                />
            </div>
        );
    }

    const expectedButtonClass = 'ButtonView';

    it('button should be in the document', () => {
        const {container} = render(JSXWrapper());
        const button = container.getElementsByClassName(expectedButtonClass)[0];

        expect(button).toBeInTheDocument();
    });

    it('should have right label', () => {
        const label = 'test-label';

        const {getByText} = render(JSXWrapper({
            label,
        }));

        expect(getByText(label)).toBeInTheDocument();
    });

    it('should have right color, outline, loading, fontThickness, size', () => {
        const buttonProperties: IButtonProps = {
            color: 'info',
            outline: true,
            isLoading: true,
            fontThickness: 'bold',
            size: 'md',
        };

        const {container} = render(JSXWrapper(buttonProperties));

        const button = container.getElementsByClassName(expectedButtonClass)[0];

        expect(button).toHaveClass(`${expectedButtonClass}_outline_${buttonProperties.color}`);
        expect(button).toHaveClass(`${expectedButtonClass}_loading`);
        expect(button).toHaveClass(`${expectedButtonClass}_thickness_${buttonProperties.fontThickness}`);
        expect(button).toHaveClass(`${expectedButtonClass}_size_${buttonProperties.size}`);
    });

    it('should have disabled', () => {
        const disabled = 'disabled';

        const {container} = render(JSXWrapper(
            {
                [disabled]: true,
            },
        ));

        const button = container.getElementsByClassName(expectedButtonClass)[0];

        expect(button).toHaveClass(`${expectedButtonClass}_${disabled}`);
    });

    it('should have hint', () => {
        const hint = 'test-hint';

        const {container} = render(JSXWrapper(
            {
                hint,
            },
        ));

        const button = container.getElementsByClassName(expectedButtonClass)[0];

        expect(button).toHaveAttribute('title', hint);
    });

    it('should have failed', () => {
        const {container} = render(JSXWrapper(
            {
                isFailed: true,
            },
        ));

        const button = container.getElementsByClassName(expectedButtonClass)[0];

        expect(button).toHaveClass(`${expectedButtonClass}_failed`);
    });

    it('should be block and link', () => {
        const {container} = render(JSXWrapper(
            {
                block: true,
                link: true,
            },
        ));

        const link = container.getElementsByClassName(expectedButtonClass)[0];

        expect(link).toHaveAttribute('href', '#');
        expect(link).toHaveClass('btn-link');
        expect(link).toHaveClass('btn-block');
    });

    it('should be tag', () => {
        const {container} = render(JSXWrapper(
            {
                tag: 'a',
            },
        ));

        const tag = container.getElementsByTagName('a')[0];

        expect(tag).toBeInTheDocument();
    });

    it('should have badge', () => {
        const badgeContent = 2;

        const {container} = render(JSXWrapper({
            badge: badgeContent,
        }));

        const badge = container.getElementsByClassName(`${expectedButtonClass}__badge`)[0];

        expect(badge).toBeInTheDocument();
        expect(badge).toHaveTextContent(badgeContent.toString());
    });

    it('should have external styles and className', () => {
        const externalClassName = 'test-button';

        const externalStyle = {
            width: '30px',
        };

        const {container} = render(JSXWrapper({
            style: externalStyle,
            className: externalClassName,
        }));

        const button = container.getElementsByClassName(expectedButtonClass)[0];

        expect(button).toHaveStyle(externalStyle);
        expect(button).toHaveClass(externalClassName);
    });

    it('default click', () => {
        const mockedOnClick = jest.fn();

        const {container} = render(JSXWrapper(
            {
                onClick: mockedOnClick,

            },
        ));

        const button = container.getElementsByTagName('button')[0];
        const expectedClickCallCount = 1;
        fireEvent.click(button);

        expect(mockedOnClick.mock.calls.length).toBe(expectedClickCallCount);
    });

    //Todo confirm action
});
