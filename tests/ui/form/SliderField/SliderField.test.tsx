import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {render} from '../../../customRender';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import SliderField, {ISliderFieldProps} from '../../../../src/ui/form/SliderField/SliderField';

describe('SliderField tests', () => {
    const expectedSliderFieldClassName = 'SliderFieldView';
    const externalClassName = 'external-class';
    const externalStyle = {width: '30px'};
    const expectedSliderClass = 'rc-slider';

    const marks = {
        0: <strong>0°C</strong>,
        26: '26°C',
        37: '37°C',
        50: '50°C',
        80: {
            style: {
                color: 'red',
            },
            label: <strong>80°C</strong>,
        },
    };

    const props: ISliderFieldProps = {
        style: externalStyle,
        className: externalClassName,
        marks,
        min: -10,
        max: 80,
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(SliderField, props));
        const sliderField = getElementByClassName(container, expectedSliderFieldClassName);
        expect(sliderField).toBeInTheDocument();
    });

    it('should have external className and style', () => {
        const {container} = render(JSXWrapper(SliderField, props));
        const sliderField = getElementByClassName(container, expectedSliderFieldClassName);
        expect(sliderField).toHaveClass(externalClassName);
        expect(sliderField).toHaveStyle(externalStyle);
    });

    it('should be disabled', () => {
        const {container} = render(JSXWrapper(SliderField, {
            ...props,
            disabled: true,
        }));

        const disabledSlider = getElementByClassName(container, `${expectedSliderClass}-disabled`);
        expect(disabledSlider).toBeInTheDocument();
    });

    it('should have marks and min max', () => {
        const {container} = render(JSXWrapper(SliderField, props));

        const expectMarksCount = 5;

        const sliderHandle = getElementByClassName(container, `${expectedSliderClass}-handle`);
        const markElements = container.querySelectorAll(`.${expectedSliderClass}-mark-text`);

        expect(sliderHandle).toHaveAttribute('aria-valuemax', String(props.max));
        expect(sliderHandle).toHaveAttribute('aria-valuemin', String(props.min));
        expect(markElements.length).toBe(expectMarksCount);
    });

    it('should be range', () => {
        const {container} = render(JSXWrapper(SliderField, {
            ...props,
            isRange: true,
        }));

        const expectedSliderHandlersCount = 2;
        const sliderHandlers = container.querySelectorAll(`.${expectedSliderClass}-handle`);
        expect(sliderHandlers.length).toBe(expectedSliderHandlersCount);
    });
});
