import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {render} from '../../../customRender';
import Alert from '../../../../src/ui/content/Alert';
import AlertView from './AlertMockView';

describe('Alert', () => {
    const props = {
        className: 'test',
        type: 'info',
        message: 'Are you sure?',
        description: 'It is maybe dangerous',
        style: {width: '45%'},
        showClose: true,
        showIcon: true,
        testId: 'alert-test',
        view: AlertView,
    };

    const JSXWrapper = (
        <div>
            <Alert {...props} />
        </div>
    );

    const expectedAlertClass = 'AlertView';

    it('should render something without props', () => {
        const {container} = render(<Alert view={AlertView} />);

        expect(container).not.toBeEmptyDOMElement();
    });

    it('should be in the document', () => {
        const {getByTestId} = render(JSXWrapper);
        const alert = getByTestId(props.testId);

        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass(expectedAlertClass);
    });

    it('should render right icons', () => {
        const {getByTestId, getAllByRole} = render(JSXWrapper);
        const alert = getByTestId(props.testId);
        const closeIconIndex = 1;
        const closeIcon = getAllByRole('img')[closeIconIndex];

        expect(alert).toHaveClass(`${expectedAlertClass}_${props.type}`);
        expect(closeIcon).toHaveClass(`${expectedAlertClass}__icon-close`);
    });

    it('should have right external className', () => {
        const {getByTestId} = render(JSXWrapper);
        const alert = getByTestId(props.testId);

        expect(alert).toHaveClass(props.className);
    });

    it('should have right message and description', () => {
        const {getByText} = render(JSXWrapper);

        expect(getByText(props.message)).toBeInTheDocument();
        expect(getByText(props.description)).toBeInTheDocument();
    });

    it('should have right external style', () => {
        const {getByTestId} = render(JSXWrapper);
        const alert = getByTestId(props.testId);

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

        const actionJSXWrapper = (
            <div>
                <Alert {...actionProps} />
            </div>
        );

        it('should click to close call callback', () => {
            const {container} = render(actionJSXWrapper);
            const closeIconIndex = 0;
            const closeIcon = container.getElementsByClassName(`${expectedAlertClass}__icon-close`)[closeIconIndex];
            const expectedCloseCallCount = 1;
            fireEvent.click(closeIcon);

            expect(mockedOnClose.mock.calls.length).toBe(expectedCloseCallCount);
        });
    });
});
