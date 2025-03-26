import Enum from '../base/Enum';

export default class FieldEnum extends Enum {
    static readonly AUTO_COMPLETE = 'AutoCompleteField';

    static readonly BLANK = 'BlankField';

    static readonly BUTTON = 'Button';

    static readonly CHECKBOX = 'CheckboxField';

    static readonly CHECKBOX_LIST = 'CheckboxListField';

    static readonly CHECKBOX_TREE = 'CheckboxTreeField';

    static readonly DATE = 'DateField';

    static readonly DATE_RANGE = 'DateRangeField';

    static readonly DATE_TIME = 'DateTimeField';

    static readonly DATE_TIME_RANGE = 'DateTimeRangeField';

    static readonly DROPDOWN = 'DropDownField';

    static readonly EMAIL = 'EmailField';

    static readonly FIELD = 'Field';

    static readonly FIELD_LAYOUT = 'FieldLayout';

    static readonly FIELD_SET = 'FieldSet';

    static readonly FILE = 'FileField';

    static readonly FORM = 'Form';

    static readonly HTML = 'HtmlField';

    static readonly IMAGE = 'ImageField';

    static readonly INPUT = 'InputField';

    static readonly MASK = 'MaskField';

    static readonly NAV = 'NavField';

    static readonly NUMBER = 'NumberField';

    static readonly PASSWORD = 'PasswordField';

    static readonly RADIO = 'RadioField';

    static readonly RADIO_LIST = 'RadioListField';

    static readonly RATE = 'RateField';

    static readonly RE_CAPTCHA = 'ReCaptchaField';

    static readonly SLIDER = 'SliderField';

    static readonly SWITCHER = 'SwitcherField';

    static readonly TEXT = 'TextField';

    static readonly TIME = 'TimeField';

    static readonly TIME_RANGE = 'TimeRangeField';

    static readonly WIZARD_FORM = 'WizardForm';

    static getLabels() {
        return {
            [FieldEnum.AUTO_COMPLETE]: 'AutoCompleteField',
            [FieldEnum.BLANK]: 'BlankField',
            [FieldEnum.BUTTON]: 'Button',
            [FieldEnum.CHECKBOX]: 'CheckboxField',
            [FieldEnum.CHECKBOX_LIST]: 'CheckboxListField',
            [FieldEnum.CHECKBOX_TREE]: 'CheckboxTreeField',
            [FieldEnum.DATE]: 'DateField',
            [FieldEnum.DATE_RANGE]: 'DateRangeField',
            [FieldEnum.DATE_TIME]: 'DateTimeField',
            [FieldEnum.DATE_TIME_RANGE]: 'DateTimeRangeField',
            [FieldEnum.DROPDOWN]: 'DropDownField',
            [FieldEnum.EMAIL]: 'EmailField',
            [FieldEnum.FIELD]: 'Field',
            [FieldEnum.FIELD_LAYOUT]: 'FieldLayout',
            [FieldEnum.FIELD_SET]: 'FieldSet',
            [FieldEnum.FILE]: 'FileField',
            [FieldEnum.FORM]: 'Form',
            [FieldEnum.HTML]: 'HtmlField',
            [FieldEnum.IMAGE]: 'ImageField',
            [FieldEnum.INPUT]: 'InputField',
            [FieldEnum.MASK]: 'MaskField',
            [FieldEnum.NAV]: 'NavField',
            [FieldEnum.NUMBER]: 'NumberField',
            [FieldEnum.PASSWORD]: 'PasswordField',
            [FieldEnum.RADIO]: 'RadioField',
            [FieldEnum.RADIO_LIST]: 'RadioListField',
            [FieldEnum.RATE]: 'RateField',
            [FieldEnum.RE_CAPTCHA]: 'ReCaptchaField',
            [FieldEnum.SLIDER]: 'SliderField',
            [FieldEnum.SWITCHER]: 'SwitcherField',
            [FieldEnum.TEXT]: 'TextField',
            [FieldEnum.TIME]: 'TimeField',
            [FieldEnum.TIME_RANGE]: 'TimeRangeField',
            [FieldEnum.WIZARD_FORM]: 'WizardForm',
        };
    }
}

export type FieldEnumType = ReturnType<typeof Array<keyof ReturnType<typeof FieldEnum.getLabels>>>[number];
