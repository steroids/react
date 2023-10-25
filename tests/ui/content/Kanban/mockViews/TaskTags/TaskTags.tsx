import * as React from 'react';
import {Badge} from '../../../../../../src/ui/content';
import {useBem} from '../../../../../../src/hooks';
import {ITaskTag} from '../../../../../../src/ui/content/Kanban/Kanban';

interface ITaskTagsProps {
    tags: ITaskTag[];
    showClose?: boolean;
    onClose?: (id: number) => void,
}

export default function TaskTags(props: ITaskTagsProps) {
    const bem = useBem('TaskTags');

    return (
        <div
            className={bem.block()}
        >
            {props.tags.map((tag) => (
                <Badge
                    key={tag.id}
                    size="md"
                    roundingStyle="squarer"
                    message={tag.message}
                    type={tag.type}
                    showClose={props.showClose}
                    onClose={() => props.onClose(tag.id)}
                />
            ))}
        </div>
    );
}
