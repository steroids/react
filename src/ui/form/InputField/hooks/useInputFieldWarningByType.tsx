/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
import {useMount} from 'react-use';
import {IElementInputType} from '../InputField';

export const INPUT_TYPES_SUPPORTED_SELECTION = ['text', 'search', 'tel', 'url', 'password'];

const INPUT_TYPES_REPLACEMENT_HASH = {
    email: 'EmailField',
    date: 'DateField',
    month: 'DateField',
    week: 'CalendarSystem',
    time: 'DateTimeField',
    'datetime-local': 'DateField',
    number: 'NumberField',
    range: 'SliderField',
    checkbox: 'CheckboxField',
    radio: 'RadioField',
    button: 'Button',
    file: 'FileField',
    submit: 'Button',
    image: 'Button',
    reset: 'Button',
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
