import _find from 'lodash-es/find';

import Enum from '../../../../base/Enum';
import {ITaskPriority} from '../Kanban';

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

    static getLabel(id) {
        return this.getLabels()[id || this.DEFAULT] || '';
    }

    static getColorsByType() {
        return {
            [this.HIGH]: 'danger',
            [this.MIDDLE]: 'warning',
            [this.DEFAULT]: 'light-gray',
        };
    }

    static getColorByType(type) {
        return this.getColorsByType()[type || this.DEFAULT] || '';
    }

    static getPrioritiesArray(): ITaskPriority[] {
        return [
            {
                id: 1,
                type: this.HIGH,
            },
            {
                id: 2,
                type: this.MIDDLE,
            },
            {
                id: 3,
                type: this.DEFAULT,
            },
        ];
    }

    static getPriorityById(id) {
        return _find(this.getPrioritiesArray(), {id}) || null;
    }

    static getDefaultSelectedPriorityId() {
        const defaultPriority = _find(this.getPrioritiesArray(), {type: this.DEFAULT});
        return defaultPriority ? defaultPriority.id : null;
    }
}
