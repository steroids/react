/* eslint-disable import/no-extraneous-dependencies */
import Slider, {SliderTooltip, Handle, Range} from 'rc-slider';
import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import {ISliderFieldViewProps} from '../../../../src/ui/form/SliderField/SliderField';

const createRangeWithTooltip = Slider.createSliderWithTooltip;
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const RangeComponent: any = createRangeWithTooltip(Range);
const SliderComponent: any = createSliderWithTooltip(Slider);

export default function SliderFieldView(props: ISliderFieldViewProps) {
    const bem = useBem('SliderFieldView');

    const handle = (prevProps) => {
        const {value} = prevProps;
        return (
            <SliderTooltip
                prefixCls='rc-slider-tooltip'
                placement='top'
                overlay={`${value}`}
            >
                <Handle value={value} />
            </SliderTooltip>
        );
    };

    const commonProps = {
        slider: props.slider,
        className: props.className,
        min: props.min,
        max: props.max,
        step: props.step,
        marks: props.marks,
        onChange: props.onChange,
        onAfterChange: props.onAfterChange,
        defaultValue: props.defaultValue
            ? props.defaultValue
            : (props.isRange ? props.rangeDefaultValue : props.sliderDefaultValue),
        disabled: props.disabled,
        tipFormatter: value => `${value + props.valuePostfix}`,
        handle,
    };

    const RangeField = (
        <RangeComponent
            {...commonProps}
            draggableTrack
            areaDisabled
            pushable
        />
    );

    const SliderField = (
        <SliderComponent {...commonProps} />
    );

    return (
        <div
            className={bem(
                bem.block(),
                props.className,
            )}
            style={props.style}
        >
            {props.isRange ? RangeField : SliderField}
        </div>
    );
}
