import {useMemo} from 'react';
import {ICreateOrEditTaskModalContentViewProps} from '../../../../../../../../src/ui/content/Kanban/Kanban';
import KanbanPrioritiesEnum from '../../../../../../../../src/ui/content/Kanban/enums/KanbanPrioritiesEnum';
import {Button, DropDownField, Form, HtmlField, InputField, RadioListField} from '../../../../../../../../src/ui/form';
import {Badge} from '../../../../../../../../src/ui/content';
import TagsSelector from './views/TagsSelector';
import Label from './views/Label';

export default function CreateOrEditTaskModalContentView(props: ICreateOrEditTaskModalContentViewProps) {
    const columns = useMemo(() => (
        props.columns.map((column) => (
            {
                id: column.id,
                label: column.title,
            }
        ))
    ), [props.columns]);

    const prioritiesFields = useMemo(
        () => KanbanPrioritiesEnum.getPrioritiesArray()
            .map((priority) => ({
                id: priority.id,
                label: <Badge
                    size="md"
                    roundingStyle="squarer"
                    message={KanbanPrioritiesEnum.getLabel(priority.type)}
                    type={KanbanPrioritiesEnum.getColorByType(priority.type)}
                />,
            })),
        [],
    );

    return (
        <Form
            formId={props.formId}
            className={props.bem.element('form')}
            initialValues={props.task
                ? {
                    columnId: props.columnId || null,
                    title: props.task.title || '',
                    description: props.task.description || '',
                    fullDescription: props.task.fullDescription || '',
                    tags: props.task.tags?.map((tag) => tag.id) || [],
                    priority: props.task.priority?.id || null,
                    assigner: props.task.assigner?.id || null,
                }
                : {
                    columnId: props.columnId || null,
                }}
            onSubmit={(data) => {
                props.onSubmit(props.task?.id, data, props.columnId);
            }}
            useRedux
        >
            <div
                className={props.bem.element('form-content')}
            >
                <div className={props.bem.element('row')}>
                    <Label
                        className={props.bem.element('label')}
                        content='Заголовок'
                    />
                    <div className={props.bem.element('right')}>
                        <InputField
                            attribute="title"
                            size="md"
                            showClear
                            required
                            outline
                        />
                        <div className={props.bem.element('sub-right')}>
                            <Label
                                className={props.bem.element('label')}
                                content='Переместить в'
                            />
                            <DropDownField
                                attribute='columnId'
                                items={columns}
                                size="md"
                                outline
                            />
                        </div>
                    </div>
                </div>
                <div className={props.bem.element('row')}>
                    <Label
                        className={props.bem.element('label')}
                        content='Описание'
                    />
                    <div className={props.bem.element('right', 'column')}>
                        <InputField
                            attribute="description"
                            size="md"
                            showClear
                        />
                    </div>
                </div>
                <div className={props.bem.element('row')}>
                    <div className={props.bem.element('label')} />
                    <div className={props.bem.element('right', 'column')}>
                        <HtmlField
                            attribute="fullDescription"
                            size="md"
                        />
                    </div>
                </div>
                {!!props.tags?.length && (
                    <div className={props.bem.element('row', 'tags-field')}>
                        <Label
                            className={props.bem.element('label')}
                            content='Добавить теги'
                        />
                        <div className={props.bem.element('right', 'column')}>
                            <TagsSelector
                                tags={props.tags}
                                formId={props.formId}
                            />
                        </div>
                    </div>
                )}
                <div className={props.bem.element('row')}>
                    <Label
                        className={props.bem.element('label')}
                        content='Исполнители'
                    />
                    <div className={props.bem.element('right')}>
                        <DropDownField
                            attribute='assigner'
                            selectedIds={props.task?.assigner?.id && [props.task.assigner.id]}
                            items={props.assigners}
                            showReset
                            outline
                        />
                    </div>
                </div>
                <div className={props.bem.element('row', 'radio')}>
                    <Label
                        className={props.bem.element('label')}
                        content='Приоритет'
                    />
                    <div className={props.bem.element('right')}>
                        <RadioListField
                            attribute='priority'
                            items={prioritiesFields}
                            selectedIds={[
                                props.task?.priority?.id
                                ?? KanbanPrioritiesEnum.getDefaultSelectedPriorityId(),
                            ]}
                            multiple={false}
                            orientation='horizontal'
                        />
                    </div>
                </div>
                <div className={props.bem.element('button')}>
                    <Button
                        type="submit"
                        label={props.submitButtonLabel}
                        size="md"
                    />
                </div>
            </div>
        </Form>
    );
}
