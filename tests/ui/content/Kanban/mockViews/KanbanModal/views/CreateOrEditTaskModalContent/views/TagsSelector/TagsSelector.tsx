import { useMemo } from 'react';
import {useBem, useSelector} from '../../../../../../../../../../src/hooks';
import {getFormValues} from '../../../../../../../../../../src/reducers/form';
import {ITaskTag} from '../../../../../../../../../../src/ui/content/Kanban/Kanban';
import {DropDownField} from '../../../../../../../../../../src/ui/form';
import TaskTags from '../../../../../TaskTags';

interface ITagsSelectorProps {
    tags?: ITaskTag[],
    formId?: string,
}

export default function TagsSelector(props: ITagsSelectorProps) {
    const bem = useBem('TagsSelector');

    const {tags: selectedTags} = useSelector(state => getFormValues(state, props.formId));

    const taskTags = useMemo(() => (
        props.tags.filter((tag) => selectedTags?.includes(tag.id))
    ), [props.tags, selectedTags]);

    const tagsList = useMemo(() => (
        props.tags.map((tag) => (
            {
                id: tag.id,
                label: tag.message,
                contentType: 'icon',
                contentSrc: <div className={bem.element('tag-color', tag.type)} />,
            }
        ))
    ), [bem, props.tags]);

    return (
        <div className={bem.block()}>
            {!!selectedTags?.length && (
                <TaskTags
                    tags={taskTags}
                />
            )}
            <DropDownField
                attribute="tags"
                placeholder='Выберите теги'
                multiple
                items={tagsList}
                selectedIds={selectedTags}
                autoComplete
                outline
            />
        </div>
    );
}
