import Enum from '../base/Enum';

export default class DateControlType extends Enum {
    static PrevDouble = 'PrevDouble';

    static PrevOne = 'PrevOne';

    static NextOne = 'NextOne';

    static NextDouble = 'NextDouble';

    static getLabels(): Record<string, string> {
        return {
            [this.PrevDouble]: __('PrevDouble'),
            [this.PrevOne]: __('PrevOne'),
            [this.NextOne]: __('NextOne'),
            [this.NextDouble]: __('NextDouble'),
        };
    }

    static getIcons() {
        return {
            [this.PrevDouble]: 'double_arrow_left',
            [this.PrevOne]: 'arrow_left_24x24',
            [this.NextOne]: 'arrow_right_24x24',
            [this.NextDouble]: 'double_arrow_right',
        };
    }
}
