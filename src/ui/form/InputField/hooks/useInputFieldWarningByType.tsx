/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
import {useMount} from 'react-use';

import {FieldEnum} from '../../../../enums';
import {IElementInputType} from '../InputField';

export const INPUT_TYPES_SUPPORTED_SELECTION = ['text', 'search', 'tel', 'url', 'password'];

const BUTTON_COMPONENT = 'Button';

const INPUT_TYPES_REPLACEMENT_HASH = {
    email: FieldEnum.EMAIL_FIELD,
    date: FieldEnum.DATE_FIELD,
    month: FieldEnum.DATE_FIELD,
    week: 'CalendarSystem',
    time: FieldEnum.DATE_TIME_FIELD,
    'datetime-local': FieldEnum.DATE_FIELD,
    number: FieldEnum.NUMBER_FIELD,
    range: FieldEnum.SLIDER_FIELD,
    checkbox: FieldEnum.CHECKBOX_FIELD,
    radio: FieldEnum.PASSWORD_FIELD,
    button: BUTTON_COMPONENT,
    file: FieldEnum.FILE_FIELD,
    submit: BUTTON_COMPONENT,
    image: BUTTON_COMPONENT,
    reset: BUTTON_COMPONENT,
};

export const useInputFieldWarningByType = (type: IElementInputType) => {
    useMount(() => {
        if (!INPUT_TYPES_SUPPORTED_SELECTION.includes(type)) {
            const recommendedUiComponent = `<${INPUT_TYPES_REPLACEMENT_HASH[type]} />`;

            INPUT_TYPES_REPLACEMENT_HASH[type]
                ? console.warn(`<InputField /> with "${type}" type does not support setSelectionRange() method. Try to use ${recommendedUiComponent} instead.`)
                : console.warn(`< InputField /> with "${type}" type does not support setSelectionRange() method.Try to use native <input /> tag.`);
        }
    });
};
