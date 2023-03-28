import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import Tooltip from '../../../../src/ui/layout/Tooltip/Tooltip';
import TooltipMockView from './TooltipMockView';
import {getElementByClassName, JSXWrapper} from '../../../helpers';

/*
* @Todo
* - Write a test to toHaveClass(`TooltipView_show')
*
* */

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
