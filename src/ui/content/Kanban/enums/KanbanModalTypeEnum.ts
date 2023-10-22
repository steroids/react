import Enum from '../../../../base/Enum';

export default class KanbanModalTypeEnum extends Enum {
    static DETAILS = 'details';

    static EDIT = 'edit';

    static CREATE = 'create';

    static getLabels() {
        return {
            [this.EDIT]: __('Редактировать задачу'),
            [this.CREATE]: __('Новая задача'),
        };
    }
}
