import React, {useState, useEffect} from 'react';
import {useComponents} from '../../../hooks';

/**
 * Компонент Steps предоставляет шаги для выполнения определенного процесса.
 **/
interface IStepsProps {
    stepItems: IStepItem[];
    currentStep: number;
    isChangeable?: boolean;
    className?: CssClassName;
    onChange?: (index: number) => void;
}

export interface IStepsViewProps {
    className?: CssClassName;
    children?: React.ReactNode;
}

export interface IStepItemViewProps {
    stepItem: IStepItem,
    className?: CssClassName,
    index: number,
    status: string,
    disabled: boolean,
    onChange: () => void
}

export interface IStepItem{
    title?: string;
    subtitle?: string;
    description?: string;
    icon?: string | React.ReactNode;
    isError?: boolean;
}

function Steps(props: IStepsProps): JSX.Element {
    const [isChangeable, setIsChangeable] = useState(false);

    useEffect(() => setIsChangeable(props.isChangeable), [props.isChangeable]);

    function getStepStatus(index:number, stepItem: IStepItem) {
        if (stepItem.isError) {
            return 'error';
        }
        if (props.currentStep < index) {
            return 'wait';
        }
        if (props.currentStep === index) {
            return 'active';
        }
        return 'finish';
    }

    return useComponents().ui.renderView('list.StepsView', {
        className: props.className,
        children: props.stepItems.map(
            // eslint-disable-next-line react-hooks/rules-of-hooks
            (stepItem, index) => useComponents().ui.renderView('list.StepItemView',
                {
                    stepItem,
                    index: index + 1,
                    status: getStepStatus(index, stepItem),
                    disabled: !isChangeable,
                    onChange: () => {
                        if (isChangeable) {
                            props.onChange(index);
                        }
                    },
                }),
        )});
}

Steps.defaultProps = {

};

export default Steps;
