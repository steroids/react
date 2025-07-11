import { useCallback } from 'react';
import {useBem} from '../../../../src/hooks';

import {FilesLayout, IFileFieldItemViewProps} from '../../../../src/ui/form/FileField/FileField';
import Icon from '../../../../src/ui/content/Icon';

export default function FileFieldItemView(props: IFileFieldItemViewProps) {
    const bem = useBem('FileFieldItemView');
    const isLoading = props.progress && props.progress.percent !== 100;
    const isWall = props.filesLayout === FilesLayout.wall;

    const renderLink = useCallback(() => (
        <a
            className={bem.element('link')}
            title={props.title}
            href={props.error ? '#' : props.item.url}
            target='blank'
        >
            {isWall
                ? <Icon name='view' />
                : props.title}
        </a>
    ), [bem, props.title, props.error, props.item.url, isWall]);

    const renderProgressBar = useCallback(() => (
        <div className={bem.element('progress-track')}>
            <div
                className={bem.element('progress-bar')}
                style={{width: `${props.progress.percent}%`}}
            />
        </div>
    ), [bem, props.progress]);

    const renderLoadingState = useCallback(() => (
        <div className={bem.element('left')}>
            <div className={bem.element('icon-wrapper', 'loading')}>
                <Icon
                    className={bem.element('icon-loading')}
                    name='loading_default'
                />
            </div>
            <div className={bem.element('content')}>
                <span className={bem.element('title', 'loading')}>
                    {props.title}
                </span>
                {renderProgressBar()}
                <span className={bem.element('loading-text')}>
                    {__('Uploading...')}
                </span>
            </div>
        </div>
    ), [bem, props.title, renderProgressBar]);

    const renderFileItem = useCallback(() => (
        <div className={bem.element('left')}>
            {props.image
                ? (
                    <div
                        className={bem.element('image')}
                        style={{backgroundImage: `url(${props.image.url})`}}
                    />
                )
                : (
                    <div className={bem.element('icon-wrapper')}>
                        <Icon
                            className={bem.element('icon')}
                            name={props.imagesOnly ? 'img_box' : 'clip'}
                        />
                    </div>
                )}
            {renderLink()}
            <span className={bem.element('title')}>
                {props.title}
            </span>
        </div>
    ), [bem, props.image, props.imagesOnly, props.title, renderLink]);

    return (
        <div
            className={bem.block({
                error: !!props.error,
                images: props.imagesOnly,
                isWall,
            })}
        >
            {isLoading
                ? renderLoadingState()
                : renderFileItem()}
            {props.showRemove && (
                <Icon
                    name={props.customRemoveIcon || 'trash'}
                    className={bem.element('remove', {isLoading})}
                    onClick={props.onRemove}
                />
            )}
            <div className={bem.element('overlay')} />
        </div>
    );
}
