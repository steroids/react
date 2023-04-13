export default {
    'form.InputField': {
        lazy: () => require('./form/InputField/InputFieldMockView').default,
    },
    'form.PasswordField': {
        lazy: () => require('./form/PasswordField/PasswordFieldMockView').default,
    },
};
