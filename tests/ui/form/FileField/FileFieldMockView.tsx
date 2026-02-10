import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import {FilesLayout, IFileFieldViewProps} from '../../../../src/ui/form/FileField/FileField';
import Button from '../Button/ButtonMockView';

export default function FileFieldView(props: IFileFieldViewProps) {
    const bem = useBem('FileFieldView');
    const ButtonView = props.buttonView || Button;
    const isWall = props.filesLayout === FilesLayout.wall;

    return (
        <div
            className={bem(
                bem.block({isWall}),
                props.className,
            )}
        >
            <ButtonView
                className={bem.element('button', {isWall})}
                icon='mockIcon'
                {...props.buttonProps}
            />
            <div className={bem(bem.element('files'))} />
        </div>
    );
}
