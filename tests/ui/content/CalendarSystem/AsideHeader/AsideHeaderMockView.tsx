import React, {memo} from 'react';
import useBem from '../../../../../src/hooks/useBem';
import Title from '../../../../../src/ui/typography/Title/Title';
import {Button} from '../../../../../src/ui/form';

interface IAsideHeaderProps {
    onClick?: () => void;
    className?: string;
}

function AsideHeader(props: IAsideHeaderProps) {
    const bem = useBem('AsideHeader');

    return (
        <div className={bem(
            bem.block(),
            props.className,
        )}
        >
            <Title
                content="Календарь"
                className={bem.element('title')}
            />
            <Button
                icon="mockIcon"
                size="sm"
                label="Создать"
                className={bem.element('create')}
                onClick={props.onClick}
            />
        </div>
    );
}

export default memo(AsideHeader);
