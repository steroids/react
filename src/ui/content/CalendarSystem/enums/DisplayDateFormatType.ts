import Enum from '../../../../base/Enum';

export default class DisplayDateFormatType extends Enum {
    static DEFAULT = 'default';

    static DAY = 'day';

    static getLabels(): Record<string, string> {
        return {
            [this.DEFAULT]: 'MMMM YYYY',
            [this.DAY]: 'D MMMM, dddd',
        };
    }
}
