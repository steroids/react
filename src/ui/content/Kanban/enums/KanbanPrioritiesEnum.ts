import Enum from '../../../../base/Enum';

export default class KanbanPrioritiesEnum extends Enum {
    static HIGH = 'high';

    static MIDDLE = 'middle';

    static DEFAULT = 'default';

    static getLabels() {
        return {
            [this.HIGH]: __('Высокий'),
            [this.MIDDLE]: __('Средний'),
            [this.DEFAULT]: __('Без приоритета'),
        };
    }

    static getColorByType() {
        return {
            [this.HIGH]: 'danger',
            [this.MIDDLE]: 'warning',
            [this.DEFAULT]: 'light-gray',
        };
    }

    static getDefaultSelectedPriorityId() {
        return [3];
    }
}
