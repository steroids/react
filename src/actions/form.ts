export const FORM_INITIALIZE = '@form/initialize';
export const FORM_CHANGE = '@form/change';
export const FORM_RESET = '@form/reset';
export const FORM_SET_ERRORS = '@form/set_errors';
export const FORM_SUBMIT = '@form/submit';
export const FORM_ARRAY_ADD = '@form/array_add';
export const FORM_ARRAY_REMOVE = '@form/array_remove';

/**
 * Инициализация формы, сохранение первоначальных данных
 * @param formId
 * @param values
 */
export const formInitialize = (formId, values) => ({
    type: FORM_INITIALIZE,
    formId,
    values,
});

/**
 * Изменение значения поля
 * @param formId
 * @param nameOrObject
 * @param value
 */
export const formChange = (formId, nameOrObject, value = null) => ({
    type: FORM_CHANGE,
    formId,
    nameOrObject,
    value,
});

/**
 * Задать ошибки
 * @param formId
 * @param errors
 */
export const formSetErrors = (formId, errors) => ({
    type: FORM_SET_ERRORS,
    formId,
    errors,
});

/**
 * Сабмит формы
 * @param formId
 */
export const formSubmit = (formId) => ({
    type: FORM_SUBMIT,
    formId,
});

/**
 * Сброс данных формы к первоначальному состоянию (к initialValues)
 * @param formId
 */
export const formReset = (formId) => ({
    type: FORM_RESET,
    formId,
});

export const formArrayAdd = (formId, name, rowsCount, initialValues) => ({
    type: FORM_ARRAY_ADD,
    formId,
    name,
    rowsCount,
    initialValues,
});

export const formArrayRemove = (formId, name, index) => ({
    type: FORM_ARRAY_REMOVE,
    formId,
    name,
    index,
});
