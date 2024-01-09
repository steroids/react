import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import Alert from '../../../../src/ui/content/Alert';
import AlertView from './AlertMockView';

describe('Alert', () => {
    const props = {
        className: 'test',
        type: 'mockIcon',
        message: 'Are you sure?',
        description: 'It is maybe dangerous',
        style: {width: '45%'},
        showClose: true,
        showIcon: true,
        view: AlertView,
    };

    const wrapper = JSXWrapper(Alert, props);
    const expectedAlertClass = 'AlertView';
    const testId = 'alert-test';

    it('should render something without props', () => {
        const {container} = render(<Alert view={AlertView} />);

        expect(container).not.toBeEmptyDOMElement();
    });

    it('should be in the document', () => {
        const {getByTestId} = render(wrapper);
        const alert = getByTestId(testId);

        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass(expectedAlertClass);
    });

    it('should render right icons', () => {
        const {getByTestId, getAllByRole} = render(wrapper);
        const alert = getByTestId(testId);
        const closeIconIndex = 1;
        const closeIcon = getAllByRole('img')[closeIconIndex];

        expect(alert).toHaveClass(`${expectedAlertClass}_${props.type}`);
        expect(closeIcon).toHaveClass(`${expectedAlertClass}__icon-close`);
    });

    it('should have right external className', () => {
        const {getByTestId} = render(wrapper);
        const alert = getByTestId(testId);

        expect(alert).toHaveClass(props.className);
    });

    it('should have right message and description', () => {
        const {getByText} = render(wrapper);

        expect(getByText(props.message)).toBeInTheDocument();
        expect(getByText(props.description)).toBeInTheDocument();
    });

    it('should have right external style', () => {
        const {getByTestId} = render(wrapper);
        const alert = getByTestId(testId);

        expect(alert).toHaveStyle(props.style);
    });

    describe('actions', () => {
        const mockedOnClose = jest.fn();

        const actionProps = {
            showClose: true,
            showIcon: false,
            onClose: mockedOnClose,
            view: AlertView,
        };

        it('should click to close call callback', () => {
            const {container} = render(JSXWrapper(Alert, actionProps));
            const closeIcon = getElementByClassName(container, `${expectedAlertClass}__icon-close`);
            const expectedCloseCallCount = 1;
            fireEvent.click(closeIcon);

            expect(mockedOnClose.mock.calls.length).toBe(expectedCloseCallCount);
        });
    });
});
