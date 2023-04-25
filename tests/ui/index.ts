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
    'layout.TooltipView': {
        lazy: () => require('./layout/Tooltip/TooltipMockView').default,
    },
    'content.AvatarView': {
        lazy: () => require('./content/Avatar/AvatarMockView').default,
    },
    'content.AccordionItemView': {
        lazy: () => require('./content/Accordion/AccordionItemMockView').default,
    },
    'content.AccordionView': {
        lazy: () => require('./content/Accordion/AccordionMockView').default,
    },
    'content.MenuView': {
        lazy: () => require('./content/Menu/MenuMockView').default,
    },
    'content.MenuItemView': {
        lazy: () => require('./content/Menu/MenuItemMockView').default,
    },
    'form.CheckboxFieldView': {
        lazy: () => require('./form/CheckboxField/CheckboxFieldMockView').default,
    },
    'form.RadioFieldView': {
        lazy: () => require('./form/RadioField/RadioFieldMockView').default,
    },
    'form.DropDownFieldItemView': {
        lazy: () => require('./form/DropDownField/DropDownItemMockView').default,
    },
    'form.InputFieldView': {
        lazy: () => require('./form/InputField/InputFieldMockView').default,
    },
    'form.FormView': {
        lazy: () => require('./form/Form/FormMockView').default,
    },
};
