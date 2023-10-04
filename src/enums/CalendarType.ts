import Enum from '../base/Enum';

export default class CalendarType extends Enum {
    static WEEK = 'Week';

    static MONTH = 'Month';

    static getLabels(): Record<string, string> {
        return {
            [this.WEEK]: __('Week'),
            [this.MONTH]: __('Month'),
        };
    }
}
