import Enum from '../base/Enum';

export default class FieldEnum extends Enum {
    static readonly AUTO_COMPLETE_FIELD = 'AutoCompleteField';

    static readonly BLANK_FIELD = 'BlankField';

    static readonly CHECKBOX_FIELD = 'CheckboxField';

    static readonly CHECKBOX_LIST_FIELD = 'CheckboxListField';

    static readonly CHECKBOX_TREE_FIELD = 'CheckboxTreeField';

    static readonly DATE_FIELD = 'DateField';

    static readonly DATE_RANGE_FIELD = 'DateRangeField';

    static readonly DATE_TIME_FIELD = 'DateTimeField';

    static readonly DATE_TIME_RANGE_FIELD = 'DateTimeRangeField';

    static readonly DROPDOWN_FIELD = 'DropDownField';

    static readonly EMAIL_FIELD = 'EmailField';

    static readonly FIELD = 'Field';

    static readonly FIELD_LIST = 'FieldList';

    static readonly FIELD_SET = 'FieldSet';

    static readonly FILE_FIELD = 'FileField';

    static readonly HTML_FIELD = 'HtmlField';

    static readonly IMAGE_FIELD = 'ImageField';

    static readonly INPUT_FIELD = 'InputField';

    static readonly MASK_FIELD = 'MaskField';

    static readonly NAV_FIELD = 'NavField';

    static readonly NUMBER_FIELD = 'NumberField';

    static readonly PASSWORD_FIELD = 'PasswordField';

    static readonly RADIO_FIELD = 'RadioField';

    static readonly RADIO_LIST_FIELD = 'RadioListField';

    static readonly RATE_FIELD = 'RateField';

    static readonly RE_CAPTCHA_FIELD = 'ReCaptchaField';

    static readonly SLIDER_FIELD = 'SliderField';

    static readonly SWITCHER_FIELD = 'SwitcherField';

    static readonly TEXT_FIELD = 'TextField';

    static readonly TIME_FIELD = 'TimeField';

    static readonly TIME_RANGE_FIELD = 'TimeRangeField';

    static getLabels() {
        return {
            [FieldEnum.AUTO_COMPLETE_FIELD]: 'AutoCompleteField',
            [FieldEnum.BLANK_FIELD]: 'BlankField',
            [FieldEnum.CHECKBOX_FIELD]: 'CheckboxField',
            [FieldEnum.CHECKBOX_LIST_FIELD]: 'CheckboxListField',
            [FieldEnum.CHECKBOX_TREE_FIELD]: 'CheckboxTreeField',
            [FieldEnum.DATE_FIELD]: 'DateField',
            [FieldEnum.DATE_RANGE_FIELD]: 'DateRangeField',
            [FieldEnum.DATE_TIME_FIELD]: 'DateTimeField',
            [FieldEnum.DATE_TIME_RANGE_FIELD]: 'DateTimeRangeField',
            [FieldEnum.DROPDOWN_FIELD]: 'DropDownField',
            [FieldEnum.EMAIL_FIELD]: 'EmailField',
            [FieldEnum.FIELD]: 'Field',
            [FieldEnum.FIELD_LIST]: 'FieldList',
            [FieldEnum.FIELD_SET]: 'FieldSet',
            [FieldEnum.FILE_FIELD]: 'FileField',
            [FieldEnum.HTML_FIELD]: 'HtmlField',
            [FieldEnum.IMAGE_FIELD]: 'ImageField',
            [FieldEnum.INPUT_FIELD]: 'InputField',
            [FieldEnum.MASK_FIELD]: 'MaskField',
            [FieldEnum.NAV_FIELD]: 'NavField',
            [FieldEnum.NUMBER_FIELD]: 'NumberField',
            [FieldEnum.PASSWORD_FIELD]: 'PasswordField',
            [FieldEnum.RADIO_FIELD]: 'RadioField',
            [FieldEnum.RADIO_LIST_FIELD]: 'RadioListField',
            [FieldEnum.RATE_FIELD]: 'RateField',
            [FieldEnum.RE_CAPTCHA_FIELD]: 'ReCaptchaField',
            [FieldEnum.SLIDER_FIELD]: 'SliderField',
            [FieldEnum.SWITCHER_FIELD]: 'SwitcherField',
            [FieldEnum.TEXT_FIELD]: 'TextField',
            [FieldEnum.TIME_FIELD]: 'TimeField',
            [FieldEnum.TIME_RANGE_FIELD]: 'TimeRangeField',
        };
    }
}

export type FieldEnumType = ReturnType<typeof Array<keyof ReturnType<typeof FieldEnum.getLabels>>>[number];
