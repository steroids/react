import React from 'react';
import _has from 'lodash-es/has';
import _get from 'lodash-es/get';
import _reduce from 'lodash-es/reduce';
import _assign from 'lodash-es/assign';
import _isArray from 'lodash-es/isArray';
import _isEmpty from 'lodash-es/isEmpty';
import _indexOf from 'lodash-es/indexOf';
import {WizardStepItem} from '@steroidsjs/core/ui/form/WizardForm/WizardForm';
import {IFieldProps} from '@steroidsjs/core/ui/form/Field/Field';
import {ACTIVE_STATUS, ERROR_STATUS, FINISH_STATUS, WAIT_STATUS} from '../../list/Steps/Steps';

const getNestedProperty = (
    obj: IFieldProps[] | IFieldProps | React.ReactElement[] | React.ReactElement,
    propsArray: string[],
) => _reduce(propsArray, (result, prop) => result && result[prop], obj);

const getComponentAttributes = (component: React.ReactElement[] | React.ReactElement, index: number) => {
    const componentAttributesStepMap: Record<string, number> = {};

    if (Array.isArray(component)) {
        component.forEach((field) => {
            _assign(componentAttributesStepMap, getComponentAttributes(field, index));
        });
    } else {
        const attribute = getNestedProperty(component, ['props', 'attribute']) || getNestedProperty(component, ['attribute']);

        if (attribute) {
            componentAttributesStepMap[attribute] = index;
        } else {
            const children = getNestedProperty(component, ['props', 'children']);

            if (_isArray(children)) {
                children.forEach((field) => _assign(componentAttributesStepMap, getComponentAttributes(field, index)));
            } else if (children) {
                _assign(componentAttributesStepMap, getComponentAttributes(children, index));
            }
        }
    }

    return componentAttributesStepMap;
};

const getFieldsAttributes = (fields: IFieldProps[] | IFieldProps, index: number) => {
    const fieldAttributesStepMap: Record<string, number> = {};

    if (_isArray(fields)) {
        fields.forEach((field) => _assign(fieldAttributesStepMap, getFieldsAttributes(field, index)));
    } else {
        const attribute = getNestedProperty(fields, ['attribute']);

        if (attribute) {
            fieldAttributesStepMap[attribute] = index;
        }

        if (_has(fields, ['attributeFrom']) && _has(fields, ['attributeTo'])) {
            fieldAttributesStepMap[_get(fields, 'attributeFrom')] = index;
            fieldAttributesStepMap[_get(fields, 'attributeFrom')] = index;
        }

        if (_has(fields, ['items'])) {
            const children = getNestedProperty(fields, ['items']);

            if (children) {
                _assign(fieldAttributesStepMap, getFieldsAttributes(children, index));
            }
        }
    }

    return fieldAttributesStepMap;
};

export const generateFieldStepMap = (arr = []) => arr.reduce((fieldStepMap, step, index) => {
    if (_has(step, 'fields')) {
        return {
            ...fieldStepMap,
            ...getFieldsAttributes(step.fields, index),
        };
    }

    if (_has(step, 'component')) {
        return {
            ...fieldStepMap,
            ...getComponentAttributes(step.component, index),
        };
    }

    return fieldStepMap;
}, {});

export const normalizeSteps = (steps: WizardStepItem[]) => steps.map((step, index) => ({
    id: index,
    title: step.stepLabel || null,
    description: step.description || null,
    subtitle: step.subtitle || null,
    icon: step.icon || null,
    status: index === 0 ? ACTIVE_STATUS : WAIT_STATUS,
}));

export const getModifiedSteps = (prevStepsState, errorSteps, currentStep: number, nextStep: number) => {
    const newStepsState = [...prevStepsState];

    newStepsState[currentStep].status = _isEmpty(errorSteps)
        ? WAIT_STATUS
        : (_indexOf(errorSteps, currentStep) !== -1 ? ERROR_STATUS : FINISH_STATUS);

    newStepsState[nextStep].status = ACTIVE_STATUS;

    return newStepsState;
};
