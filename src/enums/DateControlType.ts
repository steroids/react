import Enum from '../base/Enum';

export default class DateControlType extends Enum {
    static PrevYear = 'PrevYear';

    static PrevMonth = 'PrevMonth';

    static NextMonth = 'NextMonth';

    static NextYear = 'NextYear';

    static getLabels(): Record<string, string> {
        return {
            [this.PrevYear]: __('PrevYear'),
            [this.PrevMonth]: __('PrevMonth'),
            [this.NextMonth]: __('NextMonth'),
            [this.NextYear]: __('NextYear'),
        };
    }

    static getIcons() {
        return {
            [this.PrevYear]: 'double_arrow_left',
            [this.PrevMonth]: 'arrow_left_24x24',
            [this.NextMonth]: 'arrow_right_24x24',
            [this.NextYear]: 'double_arrow_right',
        };
    }
}
