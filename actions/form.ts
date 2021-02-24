export const FORM_INITIALIZE = 'FORM_INITIALIZE';
export const FORM_CHANGE = 'FORM_CHANGE';
export const FORM_RESET = 'FORM_RESET';
export const FORM_ARRAY_PUSH = 'FORM_ARRAY_PUSH';
export const FORM_ARRAY_REMOVE = 'FORM_ARRAY_REMOVE';

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
 * @param name
 * @param value
 */
export const formChange = (formId, name, value) => ({
    type: FORM_CHANGE,
    formId,
    name,
    value,
});

/**
 * Сброс данных формы к первоначальному состоянию (к initialValues)
 * @param formId
 */
export const formReset = (formId) => ({
    type: FORM_RESET,
    formId,
});
//
// export const formArrayPush = (formId, name, value) => {
//
// };
