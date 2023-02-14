import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
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

    it('should render something without props', () => {
        const {container} = render(<Alert view={AlertView} />);

        expect(container).not.toBeEmptyDOMElement();
    });

    it('should be in the document', () => {
        const {getByTestId} = render(JSXWrapper);
        const alert = getByTestId(props.testId);

        expect(alert).toBeInTheDocument();
        const expectedAlertClass = 'AlertView';
        expect(alert).toHaveClass(expectedAlertClass);
    });
});
