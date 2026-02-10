import {IFieldProps} from '@steroidsjs/core/ui/form/Field/Field';
import _has from 'lodash-es/has';
import _indexOf from 'lodash-es/indexOf';
import _isEmpty from 'lodash-es/isEmpty';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {generateFieldStepMap, getModifiedSteps, normalizeSteps} from './utils';
import {useComponents} from '../../../hooks';
import {IStepsProps, IStepItem, ACTIVE_STATUS, ERROR_STATUS, FINISH_STATUS} from '../../list/Steps/Steps';
import {IButtonProps} from '../Button/Button';
import Form, {IFormProps} from '../Form/Form';

export interface IWizardStepItem extends Partial<IStepItem> {
    fields?: IFieldProps[],
    component?: React.ReactNode,
    stepLabel?: string,
}

/**
 * WizardForm
 *
 * Компонент для создания пошаговой формы. Предоставляет управление и синхронизацию состояния формы,
 * а также список шагов формы для удобной навигации.
 * Поля для шагов можно передавать как в виде компонентов, так и в виде объекта с названием поля.
 * Позволяет выполнять отправку данных формы на сервер с возможностью валидации и перехода к неверно заполненным полям.
 *
 */

export interface IWizardFormProps extends IUiComponent {
    /**
     * Идентификатор формы
     * @example WizardForm
     */
    formId: string,

    /**
     * Коллекция полей и аттрибутов для каждого шага формы. Можно передавать как компонент, так и объект с полями.
     * Главное, чтобы внутри шага использовался один из способов.
     * @example
     * [
     *  {
     *   title: 'Step 1',
     *   fields: [
     *     {
     *       attribute: 'category',
     *       component: 'DropDownField'
     *     },
     *   ],
     *  },
     *  {
     *   title: 'Step 2',
     *   component: (
     *      <InputField
     *        attribute='address'
     *      />
     *   )
     *  }
     * ]
     */
    steps: IWizardStepItem[],

    /**
     * Свойства для Form
     */
    formProps: Omit<IFormProps, 'formId' | 'fields' | 'useRedux'> & {
        submitButtonLabel: string,
    },

    /**
     * Обработчик, который вызывается после перехода на следующий шаг формы
     * @param {number} value
     * @return {void}
     */
    onNextStep?: (nextStep: number) => void,

    /**
     * Обработчик, который вызывается после возврата на предыдущий шаг формы
     * @param {number} value
     * @return {void}
     */
    onPrevStep?: (prevStep: number) => void,

    /**
     * Свойства для кнопки возврата
     */
    prevStepButtonProps?: IButtonProps,

    /**
     * Свойства для кнопки продолжить/отправить
     */
    nextStepButtonProps?: IButtonProps,

    /**
     * Свойства для Steps
     */
    stepsProps?: Pick<IStepsProps, 'stepItems'>,

    /**
     * Ориентация списка шагов формы
     * @example 'horizontal'
     */
    stepTitleOrientation?: Orientation,

    /**
     * Показывать ли шаги
     * @example true
     */
    showSteps?: boolean,
}

export interface IWizardFormViewProps extends Pick<IWizardFormProps,
    'prevStepButtonProps'
    | 'nextStepButtonProps'
    | 'stepsProps'
    | 'showSteps'
> {
    currentStep: number,
    stepTitle: string,
    stepItems: IStepItem[],
    renderStep: (header: React.ReactNode, buttons: React.ReactNode, viewProps?: IUiComponent) => JSX.Element,
    isLastStep?: boolean,
    onPrevStep?: () => void,
    totalSteps?: number,
}

const INITIAL_STEP = 0;

export default function WizardForm(props: IWizardFormProps) {
    const components = useComponents();

    const [currentStep, setCurrentStep] = useState(INITIAL_STEP);
    const [errorSteps, setErrorSteps] = useState([]);
    const [steps, setSteps] = useState(normalizeSteps(props.steps));

    const totalSteps = useMemo(() => props.steps.length || 0, [props.steps.length]);
    const isLastStep = useMemo(() => currentStep === totalSteps - 1, [currentStep, totalSteps]);
    const activeStep = useMemo(() => props.steps[currentStep], [currentStep, props.steps]);

    const fieldStepMap = useMemo(() => generateFieldStepMap(props.steps || []), [props.steps]);

    useEffect(() => {
        if (!_isEmpty(errorSteps)) {
            setCurrentStep(errorSteps[0]);
        }
    }, [errorSteps]);

    const onNextStep = useCallback(() => {
        const nextStep = Math.min(currentStep + 1, totalSteps - 1);

        if (props.onNextStep) {
            props.onNextStep(nextStep);
        }

        setSteps(
            (prevStepsState) => getModifiedSteps(
                prevStepsState,
                errorSteps,
                currentStep,
                nextStep,
            ),
        );

        setCurrentStep(nextStep);
    }, [currentStep, totalSteps, props, errorSteps]);

    const onPrevStep = useCallback(() => {
        const prevStep = Math.max(currentStep - 1, INITIAL_STEP);

        if (props.onPrevStep) {
            props.onPrevStep(prevStep);
        }

        setSteps((prevStepsState) => getModifiedSteps(
            prevStepsState,
            errorSteps,
            currentStep,
            prevStep,
        ));

        setCurrentStep(prevStep);
    }, [currentStep, props, errorSteps]);

    const onSubmit = useCallback((data) => {
        if (isLastStep) {
            return props.formProps.onSubmit ? props.formProps.onSubmit(data) : null;
        }

        return onNextStep();
    }, [isLastStep, onNextStep, props.formProps]);

    const onAfterSubmit = useCallback((cleanedValues, data, response) => {
        if (props.formProps.onAfterSubmit && !!props.formProps.onAfterSubmit(cleanedValues, data, response)) {
            return false;
        }

        if (data.errors) {
            const stepsIdsWithErrorFields = Object.keys(data.errors)
                .reduce((acc, errorField) => {
                    if (_has(fieldStepMap, errorField)) {
                        acc.push(fieldStepMap[errorField]);
                    }
                    return acc;
                }, [] as number[])
                .sort();

            if (!_isEmpty(stepsIdsWithErrorFields)) {
                const firstStepErrorField = stepsIdsWithErrorFields[0];

                setSteps((prevStepsState) => [...prevStepsState].map((step) => {
                    if (_indexOf(stepsIdsWithErrorFields, step.id) !== -1) {
                        step.status = step.id === firstStepErrorField ? ACTIVE_STATUS : ERROR_STATUS;
                    } else {
                        step.status = FINISH_STATUS;
                    }

                    return step;
                }));

                setErrorSteps(stepsIdsWithErrorFields);
            }
        }

        return true;
    }, [fieldStepMap, props.formProps]);

    const commonFormProps = useMemo(() => ({
        formId: props.formId,
        onSubmit: (!isLastStep || props.formProps.onSubmit) && onSubmit,
        onAfterSubmit,
        fields: activeStep?.fields ?? null,
        useRedux: true,
    }), [activeStep?.fields, isLastStep, onAfterSubmit, onSubmit, props.formProps.onSubmit, props.formId]);

    const renderStep = useCallback(
(header: React.ReactNode, buttons: React.ReactNode, viewProps: IUiComponent) => (
    <Form
        {...props.formProps}
        {...viewProps}
        {...commonFormProps}
        buttons={buttons}
    >
        {header}
        {activeStep?.component && props.steps[currentStep].component}
    </Form>
    ),
    [activeStep?.component, commonFormProps, currentStep, props.formProps, props.steps],
);

    const viewProps = useMemo(() => ({
        renderStep,
        currentStep,
        isLastStep,
        totalSteps,
        onPrevStep,
        prevStepButtonProps: props.prevStepButtonProps,
        nextStepButtonProps: {
            ...props.nextStepButtonProps,
            label: isLastStep ? props.formProps.submitButtonLabel : props.nextStepButtonProps.label,
        },
        showSteps: props.showSteps,
        stepsProps: {
            ...props.stepsProps,
            stepTitleOrientation: props.stepTitleOrientation,
        },
        stepItems: steps,
        stepTitle: activeStep.title,
    }), [renderStep, currentStep, isLastStep, totalSteps, onPrevStep, props.prevStepButtonProps, props.nextStepButtonProps,
        props.formProps.submitButtonLabel, props.showSteps, props.stepsProps, props.stepTitleOrientation, steps, activeStep.title]);

    return components.ui.renderView(props.view || 'form.WizardFormView', viewProps);
}

WizardForm.defaultProps = {
    formProps: {
        label: __('Отправить'),
    },
    prevStepButtonProps: {
        color: 'primary',
        icon: 'left_12x12',
        outline: true,
        label: __('Назад'),
    },
    nextStepButtonProps: {
        label: __('Далее'),
    },
    showSteps: true,
};
