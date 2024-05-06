import Enum from '../../../../base/Enum';

export default class CalendarType extends Enum {
    static WEEK = 'Week';

    static MONTH = 'Month';

    static DAY = 'Day';

    static getLabels(): Record<string, string> {
        return {
            [this.DAY]: __('День'),
            [this.WEEK]: __('Неделя'),
            [this.MONTH]: __('Месяц'),
        };
    }
}
