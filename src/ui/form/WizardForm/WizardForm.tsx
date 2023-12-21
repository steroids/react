import React, {useCallback, useEffect, useMemo, useState} from 'react';
import _get from 'lodash-es/get';
import _has from 'lodash-es/has';
import _isEmpty from 'lodash-es/isEmpty';
import _indexOf from 'lodash-es/indexOf';
import {
    IStepsProps,
    ACTIVE_STATUS,
    ERROR_STATUS,
    FINISH_STATUS,
} from '../../list/Steps/Steps';
import {useComponents} from '../../../hooks';
import {IButtonProps} from '../Button/Button';
import Form, {IFormProps} from '../Form/Form';
import {generateFieldStepMap, getModifiedSteps, normalizeStepItems} from './utils';

export interface IWizardFormProps extends IUiComponent {
    /**
     * Идентификатор формы
     * @example WizardForm
     */
    wizardFormId: string;

    /**
     * Пропсы для Form
     */
    formProps: {
        fields: IFormProps['fields'][]
    } & Omit<IFormProps, 'fields' | 'useRedux'>;

    /**
     * Пропсы для Steps
     */
    stepsProps?: Pick<IStepsProps, 'stepItems'>;

    /**
     * Надпись на кнопке отправки формы
     * @example Submit
     */
    submitLabel?: string;

    /**
     * Надпись на кнопке перехода на следующий шаг формы
     * @example Next
     */
    nextStepLabel?: string;

    /**
     * Поля для шагов формы. Для разделения на шаги, нужно обернуть каждый шаг в `WizardFormItemView`
     */
    children: React.ReactNode;

    /**
     * Обработчик, который вызывается после перехода на следующий шаг формы
     * @param {number} value
     * @return {void}
     */
    onNextStep?: (nextStep: number) => any;

    /**
     * Обработчик, который вызывается после возврата на предыдущий шаг формы
     * @param {number} value
     * @return {void}
     */
    onPrevStep?: (prevStep: number) => any;

    /**
     * Свойства для кнопки возврата
     */
    prevStepButtonProps?: IButtonProps;

    /**
     * Переопределение view компонента формы для кастомизации отображения
     * @example MyCustomView
     */
    formView?: CustomView;

    /**
     * Свойства для представления формы
     * @example {className: 'foo'}
     */
    formViewProps?: any;

    /**
     * Заголовки для шагов формы
     */
    stepsTitles?: string[];

    /**
     * Показывать ли шаги
     * @example true
     */
    showSteps?: boolean;

    /**
     * Кастомная вьюшка для элемента
     */
    itemView?: CustomView,
}

export interface IWizardFormViewProps extends Pick<IWizardFormProps,
    'prevStepButtonProps'
    | 'stepsProps'
    | 'showSteps'
    | 'submitLabel'
    | 'nextStepLabel'
> {
    currentStep: number;
    stepTitle: string;
    renderStep: (header: React.ReactNode, buttons: React.ReactNode, viewProps?: IUiComponent) => JSX.Element;
    isLastStep?: boolean;
    onPrevStep?: () => void;
    totalSteps?: number;
}

export interface IWizardFormItemViewProps {
    children: React.ReactNode,
}

const INITIAL_STEP = 0;

export default function WizardForm(props: IWizardFormProps) {
    const components = useComponents();

    const [currentStep, setCurrentStep] = useState(INITIAL_STEP);

    const [errorSteps, setErrorSteps] = useState([]);

    const totalSteps = useMemo(() => React.Children.count(props.children) || props.formProps?.fields?.length || 0,
        [props.children, props.formProps?.fields?.length]);

    const [steps, setSteps] = useState(normalizeStepItems(props.stepsProps?.stepItems || totalSteps));

    const isLastStep = useMemo(() => currentStep === totalSteps - 1, [currentStep, totalSteps]);

    const activeStepFields = useMemo(
        () => React.Children.toArray(props.children)[currentStep],
        [currentStep, props.children],
    );

    const fieldStepMap = useMemo(() => generateFieldStepMap(
        props.children
            ? React.Children.toArray(props.children)
            : (props.formProps?.fields || []),
    ), [props.children, props.formProps?.fields]);

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
        if (props.formProps.onAfterSubmit && props.formProps.onAfterSubmit(cleanedValues, data, response) === false) {
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

    const renderStep = useCallback((header: any, buttons: any, viewProps: IUiComponent) => (
        <Form
            {...props.formProps}
            {...viewProps}
            formId={props.wizardFormId}
            onSubmit={(!isLastStep || props.formProps.onSubmit) && onSubmit}
            onAfterSubmit={onAfterSubmit}
            fields={_get(props, ['formProps', 'fields', currentStep], null)}
            view={props.formView}
            viewProps={props.formViewProps}
            buttons={buttons}
            useRedux
        >
            {header}
            {activeStepFields}
        </Form>
    ),
    [activeStepFields, currentStep, isLastStep, onAfterSubmit, onSubmit, props]);

    return components.ui.renderView(props.view || 'form.WizardFormView', {
        renderStep,
        currentStep,
        isLastStep,
        totalSteps,
        onPrevStep,
        submitLabel: props.submitLabel,
        nextStepLabel: props.nextStepLabel,
        prevStepButtonProps: props.prevStepButtonProps,
        showSteps: props.showSteps,
        stepsProps: {
            ...props.stepsProps,
            stepItems: steps,
        },
        stepTitle: _get(props, ['stepsTitles', currentStep], null),
    });
}

WizardForm.defaultProps = {
    prevStepButtonProps: {
        color: 'primary',
        icon: 'left_12x12',
        outline: true,
        label: __('Назад'),
    },
    submitLabel: __('Отправить'),
    nextStepLabel: __('Далее'),
    showSteps: true,
};
