import * as React from 'react';

import CreateOrEditTaskModalContent from './views/CreateOrEditTaskModalContent';
import TaskDetailsModalContent from './views/TaskDetailsModalContent';
import {useBem} from '../../../../../../src/hooks';
import {IKanbanModalViewProps} from '../../../../../../src/ui/content/Kanban/Kanban';
import {KanbanModalTypeEnum} from '../../../../../../src/ui/content/Kanban/enums';
import Modal from '../../../../../../src/ui/modal/Modal/Modal';

export default function KanbanModalView(props: IKanbanModalViewProps) {
    const bem = useBem('KanbanModalView');

    const renderModalContent = React.useCallback((modalType: KanbanModalTypeEnum) => {
        switch (modalType) {
            case KanbanModalTypeEnum.CREATE:
                return (
                    <CreateOrEditTaskModalContent
                        bem={bem}
                        formId={props.formId}
                        columns={props.columns}
                        columnId={props.columnId}
                        tags={props.tags}
                        assigners={props.assigners}
                        submitButtonLabel='Создать'
                        onSubmit={props.onSubmit}
                    />
                );
            case KanbanModalTypeEnum.DETAILS:
                return (
                    <TaskDetailsModalContent
                        bem={bem}
                        task={props.task}
                    />
                );
            case KanbanModalTypeEnum.EDIT:
                return (
                    <CreateOrEditTaskModalContent
                        bem={bem}
                        formId={props.formId}
                        task={props.task}
                        columns={props.columns}
                        columnId={props.columnId}
                        tags={props.tags}
                        assigners={props.assigners}
                        submitButtonLabel='Сохранить'
                        onSubmit={props.onSubmit}
                    />
                );
            default:
                return null;
        }
    }, [bem, props.assigners, props.columnId, props.columns, props.formId, props.onSubmit, props.tags, props.task]);

    const renderModalButton = React.useCallback((modalType: KanbanModalTypeEnum) => modalType !== KanbanModalTypeEnum.CREATE
        ? [{
            icon: 'mockIcon',
            onClick: props.onToggleModalType,
        }]
        : null, [props.modalType]);

    return (
        <Modal
            className={bem.block()}
            title={props.title}
            onClose={props.onClose}
            size="lg"
            buttons={renderModalButton(props.modalType)}
            isOpen
        >
            {renderModalContent(props.modalType)}
        </Modal>
    );
}
