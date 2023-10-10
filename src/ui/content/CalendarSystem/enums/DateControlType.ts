import Enum from '../../../../base/Enum';

export default class DateControlType extends Enum {
    static PREV_DOUBLE = 'PREV_DOUBLE';

    static PREV_ONE = 'PREV_ONE';

    static NEXT_ONE = 'NEXT_ONE';

    static NEXT_DOUBLE = 'NEXT_DOUBLE';

    static getIcons() {
        return {
            [this.PREV_DOUBLE]: 'double_arrow_left',
            [this.PREV_ONE]: 'arrow_left_24x24',
            [this.NEXT_ONE]: 'arrow_right_24x24',
            [this.NEXT_DOUBLE]: 'double_arrow_right',
        };
    }
}
