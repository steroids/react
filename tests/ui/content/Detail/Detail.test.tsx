import React from 'react';
import '@testing-library/jest-dom';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import {render} from '../../../customRender';
import {Detail, DetailItem} from '../../../../src/ui/content/Detail';
import {DetailLayoutEnum, IDetailViewProps} from '../../../../src/ui/content/Detail/Detail';
import DetailMockView from './DetailMockView';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

describe('Detail tests', () => {
    const tableHeadText = 'Status';
    const tableValueText = 'Running';
    const expectedDetailClass = 'DetailView';
    const expectedDetailLabelClass = 'DetailView__label';
    const expectedDetailValueClass = 'DetailView__value';
    const title = 'Test';

    const props = {
        title,
        layout: DetailLayoutEnum.Vertical,
        controls: [{label: 'Edit'}],
        view: DetailMockView,
        responsive: true,
        children: <DetailItem label={tableHeadText} span={3}>{tableValueText}</DetailItem>,
    } as IDetailViewProps;

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(Detail, props));

        const DetailComponent = getElementByClassName(container, expectedDetailClass);

        expect(DetailComponent).toBeInTheDocument();
    });

    it('should render table head and row with correct attributes, classes, text', () => {
        const {getByText} = render(JSXWrapper(Detail, props));

        const tableHead = getByText(tableHeadText);
        const tableValue = getByText(tableValueText);

        expect(tableHead).toBeInTheDocument();
        expect(tableHead).toHaveClass(expectedDetailLabelClass);
        expect(tableHead).toHaveClass(`${expectedDetailLabelClass}_size_sm`);
        expect(tableHead).toHaveAttribute('colspan', '3');
        expect(tableValue).toBeInTheDocument();
        expect(tableValue).toHaveClass(expectedDetailValueClass);
        expect(tableValue).toHaveClass(`${expectedDetailValueClass}_size_sm`);
        expect(tableValue).toHaveAttribute('colspan', '3');
    });

    it('should have title', () => {
        const {getByText} = render(JSXWrapper(Detail, props));

        const tableTitle = getByText(title);

        expect(tableTitle).toBeInTheDocument();
        expect(tableTitle).toHaveClass(`${expectedDetailClass}__title`);
    });

    it('should have controls and correct controls label', () => {
        const {container, getByText} = render(JSXWrapper(Detail, props));

        const controls = getElementByClassName(container, `${expectedDetailClass}__controls`);

        expect(controls).toBeInTheDocument();

        const controlButton = getByText('Edit');

        expect(controlButton).toBeInTheDocument();
    });
});
