import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';

import BadgeMockView from './BadgeMockView';
import Badge from '../../../../src/ui/content/Badge/Badge';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('Badge tests', () => {
    const props = {
        message: 'badgeTest',
        view: BadgeMockView,
        showClose: true,
        className: 'testClass',
        style: {width: '30px'},
    };

    const testId = 'badge-test';
    const expectedBadgeClass = 'BadgeView';
    const wrapper = JSXWrapper(Badge, props);

    it('should be in the document', () => {
        const {getByTestId} = render(wrapper);
        const badge = getByTestId(testId);

        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass(expectedBadgeClass);
        expect(badge).toHaveClass(props.className);
    });

    it('should have right size, rounding, type and external className', () => {
        const {getByTestId} = render(wrapper);
        const badge = getByTestId(testId);

        expect(badge).toHaveClass(`${expectedBadgeClass}_primary`);
        expect(badge).toHaveClass(`${expectedBadgeClass}_md`);
        expect(badge).toHaveClass(`${expectedBadgeClass}_squarer`);
        expect(badge).toHaveClass(props.className);
    });

    it('should have correct message', () => {
        const {getByText} = render(wrapper);
        const message = getByText(props.message);

        expect(message).toBeInTheDocument();
    });

    it('should have right style', () => {
        const {getByTestId} = render(wrapper);
        const badge = getByTestId(testId);

        expect(badge).toHaveStyle(props.style);
    });

    describe('badge with counter', () => {
        const defaultCounterProps = {
            view: BadgeMockView,
            counter: {
                isEnable: true,
                content: 5,
            },
            message: 'badge with chip',
        };

        const counterWrapper = JSXWrapper(Badge, defaultCounterProps);

        it('should have counter', () => {
            const {getByTestId, container} = render(counterWrapper);
            const badge = getByTestId(testId);
            const counter = getElementByClassName(container, `${expectedBadgeClass}__counter`);

            expect(badge).toHaveClass(`${expectedBadgeClass}_has-counter`);
            expect(counter).toBeInTheDocument();
        });
    });

    describe('actions', () => {
        const mockedOnClose = jest.fn();

        const actionProps = {
            showClose: true,
            onClose: mockedOnClose,
            view: BadgeMockView,
        };

        const actionWrapper = JSXWrapper(Badge, actionProps);

        it('should click to close call callback', () => {
            const {container} = render(actionWrapper);
            const closeIcon = getElementByClassName(container, `${expectedBadgeClass}__close`);
            const expectedCloseCallCount = 1;
            fireEvent.click(closeIcon);

            expect(mockedOnClose.mock.calls.length).toBe(expectedCloseCallCount);
        });
    });
});
