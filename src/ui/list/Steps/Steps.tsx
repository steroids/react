import React, {useState, useEffect, useCallback} from 'react';
import _range from 'lodash-es/range';
import {useComponents} from '../../../hooks';

/**
 * Компонент Steps предоставляет шаги для выполнения определенного процесса.
 **/

export interface IStepsProps extends IUiComponent {
    stepItems: number | IStepItem[],
    currentStep: number,
    isChangeable?: boolean,
    onChange?: (index: number) => void,
    showDivider?: boolean,
    stepTitleOrientation?: Orientation,
    stepItemView?: React.ReactNode,
}

export interface IStepsViewProps {
    className?: CssClassName,
    children?: React.ReactNode,
}

export interface IStepItemViewProps extends Pick<IStepsProps, 'showDivider' | 'stepTitleOrientation' | 'onChange'>, IUiComponent {
    stepItem: IStepItem,
    index: number,
    status: string,
    disabled: boolean,
    showDivider?: boolean,
}

export interface IStepItem {
    id: number,
    title?: string,
    subtitle?: string,
    description?: string,
    status?: string,
    icon?: string | React.ReactNode,
    isError?: boolean,
}

export const ERROR_STATUS = 'error';
export const WAIT_STATUS = 'wait';
export const ACTIVE_STATUS = 'active';
export const FINISH_STATUS = 'finish';

export const HORIZONTAL_STEP_LAYOUT = 'horizontal';
export const VERTICAL_STEP_LAYOUT = 'vertical';

const getStepStatus = (index: number, stepItem: IStepItem, currentStep: number) => {
    if (stepItem.isError) {
        return ERROR_STATUS;
    }

    if (currentStep < index) {
        return WAIT_STATUS;
    }

    if (currentStep === index) {
        return ACTIVE_STATUS;
    }

    return FINISH_STATUS;
};

export default function Steps(props: IStepsProps): JSX.Element {
    const components = useComponents();

    const [isChangeable, setIsChangeable] = useState(false);

    useEffect(() => setIsChangeable(props.isChangeable), [props.isChangeable]);

    const toStep = useCallback((stepItem, index) => components.ui.renderView(
props.stepItemView || 'list.StepItemView',
        {
            key: stepItem.id,
            stepItem,
            index: index + 1,
            status: stepItem?.status || getStepStatus(index, stepItem, props.currentStep),
            disabled: !isChangeable,
            showDivider: props.showDivider,
            stepTitleOrientation: props.stepTitleOrientation,
            onChange: () => {
                if (isChangeable) {
                    props.onChange(index);
                }
            },
        },
), [components.ui, isChangeable, props]);

    return components.ui.renderView(props.view || 'list.StepsView', {
        className: props.className,
        children: (
            Array.isArray(props.stepItems)
                ? props.stepItems
                : _range(props.stepItems || 0)
        )
            .map(toStep),
    });
}

Steps.defaultProps = {
    showDivider: true,
    stepTitleOrientation: 'vertical',
};
