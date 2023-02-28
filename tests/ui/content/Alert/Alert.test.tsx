import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {render} from '../../../customRender';
import Alert from '../../../../src/ui/content/Alert';
import AlertView from './AlertMockView';
import {getElementByClassName, JSXWrapper} from '../../../helpers';

describe('Alert', () => {
    const defaultProps = {
        className: 'test',
        type: 'mockIconName',
        message: 'Are you sure?',
        description: 'It is maybe dangerous',
        style: {width: '45%'},
        showClose: true,
        showIcon: true,
        testId: 'alert-test',
        view: AlertView,
    };

    const wrapper = JSXWrapper(Alert, defaultProps);
    const expectedAlertClass = 'AlertView';

    it('should render something without props', () => {
        const {container} = render(<Alert view={AlertView} />);

        expect(container).not.toBeEmptyDOMElement();
    });

    it('should be in the document', () => {
        const {getByTestId} = render(wrapper);
        const alert = getByTestId(defaultProps.testId);

        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass(expectedAlertClass);
    });

    it('should render right icons', () => {
        const {getByTestId, getAllByRole} = render(wrapper);
        const alert = getByTestId(defaultProps.testId);
        const closeIconIndex = 1;
        const closeIcon = getAllByRole('img')[closeIconIndex];

        expect(alert).toHaveClass(`${expectedAlertClass}_${defaultProps.type}`);
        expect(closeIcon).toHaveClass(`${expectedAlertClass}__icon-close`);
    });

    it('should have right external className', () => {
        const {getByTestId} = render(wrapper);
        const alert = getByTestId(defaultProps.testId);

        expect(alert).toHaveClass(defaultProps.className);
    });

    it('should have right message and description', () => {
        const {getByText} = render(wrapper);

        expect(getByText(defaultProps.message)).toBeInTheDocument();
        expect(getByText(defaultProps.description)).toBeInTheDocument();
    });

    it('should have right external style', () => {
        const {getByTestId} = render(wrapper);
        const alert = getByTestId(defaultProps.testId);

        expect(alert).toHaveStyle(defaultProps.style);
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
