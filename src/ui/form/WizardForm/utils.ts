import _reduce from 'lodash-es/reduce';
import _range from 'lodash-es/range';
import _isArray from 'lodash-es/isArray';
import _isEmpty from 'lodash-es/isEmpty';
import _indexOf from 'lodash-es/indexOf';

import {ACTIVE_STATUS, ERROR_STATUS, FINISH_STATUS, IStepItem, WAIT_STATUS} from '../../list/Steps/Steps';

const getNestedProperty = (obj: any, propsArray: string[]) => _reduce(propsArray, (result, prop) => result && result[prop], obj);

const getFieldStep = (obj: any, index: number, fieldStepMap: Record<string, number>) => {
    if (_isArray(obj)) {
        obj.forEach((item) => getFieldStep(item, index, fieldStepMap));
    } else {
        const attribute = getNestedProperty(obj, ['props', 'attribute']) || getNestedProperty(obj, ['attribute']);

        if (attribute) {
            fieldStepMap[attribute] = index;
        } else {
            const children = getNestedProperty(obj, ['props', 'children']);

            if (_isArray(children)) {
                children.forEach((item) => getFieldStep(item, index, fieldStepMap));
            } else if (children) {
                getFieldStep(children, index, fieldStepMap);
            }
        }
    }
};

export const generateFieldStepMap = (arr = []) => {
    const fieldStepMap: Record<string, number> = {};

    arr.forEach((item, index) => getFieldStep(item, index, fieldStepMap));

    return fieldStepMap;
};

export const normalizeStepItems = (stepItems: number | IStepItem[]) => {
    if (Array.isArray(stepItems)) {
        return stepItems.map((stepItem, index) => ({
            ...stepItem,
            id: index,
            status: index === 0 ? ACTIVE_STATUS : WAIT_STATUS,
        }));
    }

    return _range(stepItems || 0).map((stepIndex) => ({
        id: stepIndex,
        status: stepIndex === 0 ? ACTIVE_STATUS : WAIT_STATUS,
    }));
};

export const getModifiedSteps = (prevStepsState, errorSteps, currentStep: number, nextStep: number) => {
    const newStepsState = [...prevStepsState];

    newStepsState[currentStep].status = _isEmpty(errorSteps)
        ? WAIT_STATUS
        : (_indexOf(errorSteps, currentStep) !== -1 ? ERROR_STATUS : FINISH_STATUS);

    newStepsState[nextStep].status = ACTIVE_STATUS;

    return newStepsState;
};
