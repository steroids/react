import React from 'react';
import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import Badge from '../../../../src/ui/content/Badge/Badge';
import BadgeMockView from './BadgeMockView';

describe('Badge tests', () => {
    const props = {
        message: 'badgeTest',
        view: BadgeMockView,
        testId: 'badge-test',
        showClose: true,
        className: 'testClass',
        style: {width: '30px'},
    };

    const expectedBadgeClass = 'BadgeView';

    const JSXWrapper = (
        <div>
            <Badge {...props} />
        </div>
    );

    it('should be in the document', () => {
        const {getByTestId} = render(JSXWrapper);
        const badge = getByTestId(props.testId);

        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass(expectedBadgeClass);
        expect(badge).toHaveClass(props.className);
    });

    it('avatar should have right size, rounding, type and external className', () => {
        const {getByTestId} = render(JSXWrapper);
        const badge = getByTestId(props.testId);

        expect(badge).toHaveClass(`${expectedBadgeClass}_primary`);
        expect(badge).toHaveClass(`${expectedBadgeClass}_medium`);
        expect(badge).toHaveClass(`${expectedBadgeClass}_squarer`);
        expect(badge).toHaveClass(props.className);
    });

    it('should have correct message', () => {
        const {getByText} = render(JSXWrapper);
        const message = getByText(props.message);

        expect(message).toBeInTheDocument();
    });

    it('should have right style', () => {
        const {getByTestId} = render(JSXWrapper);
        const badge = getByTestId(props.testId);

        expect(badge).toHaveStyle(props.style);
    });

    describe('badge with counter', () => {
        const counterProps = {
            view: BadgeMockView,
            testId: 'badge-test',
            counter: {
                isEnable: true,
                content: 5,
            },
            message: 'badge with chip',
        };

        const counterJSXWrapper = (
            <div>
                <Badge {...counterProps} />
            </div>
        );

        it('should have counter', () => {
            const {getByTestId, container} = render(counterJSXWrapper);
            const badge = getByTestId(counterProps.testId);
            const counter = container.getElementsByClassName(`${expectedBadgeClass}__counter`)[0];

            expect(badge).toHaveClass(`${expectedBadgeClass}_has-counter`);
            expect(counter).toBeInTheDocument();
        });
    });

    //TODO Action
});
