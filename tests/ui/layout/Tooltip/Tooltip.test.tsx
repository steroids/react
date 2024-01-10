import '@testing-library/jest-dom';
import {waitFor} from '@testing-library/react';
import Tooltip from '../../../../src/ui/layout/Tooltip/Tooltip';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('Tooltip tests', () => {
    const props = {
        testId: 'tooltip-test',
        position: 'bottom',
        content: 'test-content',
        children: 'children',
        defaultVisible: true,
    };

    const expectedTooltipClass = 'TooltipView';
    const wrapper = JSXWrapper(Tooltip, props, true);

    it('should be in the document and have class', () => {
        const {getByTestId} = render(wrapper);
        const tooltip = getByTestId(props.testId);

        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveClass(expectedTooltipClass);
    });

    it('should have a class modifier from the absolute positioning hook', async () => {
        const expectedTooltipShowClass = 'TooltipView_show';

        const {getByTestId} = render(wrapper);
        const tooltip = getByTestId(props.testId);

        await waitFor(() => {
            expect(tooltip).toBeInTheDocument();
            expect(tooltip).toHaveClass(expectedTooltipShowClass);
        });
    });

    it('should have correct content', () => {
        const {getByTestId} = render(wrapper);
        const content = getByTestId(props.testId);

        expect(content).toHaveTextContent(props.content);
    });

    it('should have correct children', () => {
        const {getByText} = render(wrapper);
        const children = getByText(props.children);

        expect(children).toBeInTheDocument();
    });

    it('should have right class position', () => {
        const {getByTestId} = render(wrapper);
        const tooltip = getByTestId(props.testId);

        expect(tooltip).toHaveClass(`${expectedTooltipClass}_position_${props.position}`);
    });

    it('should have right class arrow position', () => {
        const {getByTestId} = render(wrapper);
        const tooltip = getByTestId(props.testId);
        const tooltipArrow = getElementByClassName(tooltip, `${expectedTooltipClass}__arrow`);
        expect(tooltipArrow).toHaveClass(`${expectedTooltipClass}__arrow_position_${props.position}`);
    });
});
