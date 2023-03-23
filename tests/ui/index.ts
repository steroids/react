export default {
    'form.FieldLayoutView': {
        lazy: () => require('./form/FieldLayout/FieldLayoutMockView').default,
    },
    'nav.NavButtonView': {
        lazy: () => require('./nav/NavButton/NavButtonMockView').default,
    },
    'form.ButtonView': {
        lazy: () => require('./form/Button/ButtonMockView').default,
    },
    'content.DropDownView': {
        lazy: () => require('./content/DropDown/DropDownMockView').default,
    },
    'content.AccordionItemView': {
        lazy: () => require('./content/Accordion/AccordionItemMockView').default,
    },
    'content.AccordionView': {
        lazy: () => require('./content/Accordion/AccordionMockView').default,
    },
    'form.CheckboxFieldView': {
        lazy: () => require('./form/CheckboxField/CheckboxFieldMockView').default,
    },
};
