import Enum from '../base/Enum';

export default class CalendarType extends Enum {
    static Week = 'Week';

    static Month = 'Month';

    static getLabels(): Record<string, string> {
        return {
            [this.Week]: __('Week'),
            [this.Month]: __('Month'),
        };
    }
}
