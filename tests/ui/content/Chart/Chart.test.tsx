import * as React from 'react';
import '@testing-library/jest-dom';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import ChartMockView from './ChartMockView';
import Chart from '../../../../src/ui/content/Chart';
import {IButtonGroupProps} from '../../../../src/ui/nav/ButtonGroup/ButtonGroup';

const ChartComponent = (props) => <div {...props}>ChartComponent</div>;

describe('Chart tests', () => {
    const expectedChartClassName = 'ChartView';
    const expectedTitleClassName = 'ChartView__title';
    const expectedControlsClassName = 'ChartView__controls';

    const props = {
        view: ChartMockView,
        chartComponent: ChartComponent,
        className: 'testClass',
        style: {marginBottom: '70px'},
        chartHeight: 400,
        title: 'Chart Title',
        buttonGroup: {
            items: [
                'button1',
                'button2',
                'button3',
            ],
        } as IButtonGroupProps};

    const wrapper = JSXWrapper(Chart, props);

    it('should be in the document and have className', () => {
        const {container} = render(wrapper);
        const chart = getElementByClassName(container, expectedChartClassName);

        expect(chart).toBeInTheDocument();
        expect(chart).toHaveClass(props.className);
    });

    it('should have right style', () => {
        const {container} = render(wrapper);
        const chart = getElementByClassName(container, expectedChartClassName);

        expect(chart).toHaveStyle(props.style);
    });

    it('should render title from props', () => {
        const {container, getByText} = render(wrapper);

        const title = getElementByClassName(container, expectedTitleClassName);

        expect(title).toBeInTheDocument();
        expect(getByText(props.title)).toBeInTheDocument();
    });

    it('should render controls from props', () => {
        const {container} = render(wrapper);

        const controls = getElementByClassName(container, expectedControlsClassName);

        expect(controls).toBeInTheDocument();
    });
});
