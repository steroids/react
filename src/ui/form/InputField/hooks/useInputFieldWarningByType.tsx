/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
import {useMount} from 'react-use';
import {IElementInputType} from '../InputField';
import {FieldEnum} from '../../../../enums';

export const INPUT_TYPES_SUPPORTED_SELECTION = ['text', 'search', 'tel', 'url', 'password'];

const INPUT_TYPES_REPLACEMENT_HASH = {
    email: FieldEnum.EMAIL,
    date: FieldEnum.DATE,
    month: FieldEnum.DATE,
    week: 'CalendarSystem',
    time: FieldEnum.DATE_TIME,
    'datetime-local': FieldEnum.DATE,
    number: FieldEnum.NUMBER,
    range: FieldEnum.SLIDER,
    checkbox: 'CheckboxField',
    radio: FieldEnum.PASSWORD,
    button: FieldEnum.BUTTON,
    file: FieldEnum.FILE,
    submit: FieldEnum.BUTTON,
    image: FieldEnum.BUTTON,
    reset: FieldEnum.BUTTON,
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
