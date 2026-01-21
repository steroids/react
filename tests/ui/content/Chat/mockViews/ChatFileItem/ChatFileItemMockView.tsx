import {useCallback} from 'react';
import {useBem} from '../../../../../../src/hooks';
import {IFileFieldItemViewProps} from '../../../../../../src/ui/form/FileField/FileField';
import Icon from '../../../../../../src/ui/content/Icon';
import {Text} from '../../../../../../src/ui/typography';
import {FileSize} from '../../../../../../src/ui/format';
import {IMessageFile} from '../../../../../../src/ui/content/Chat/Chat';

interface IChatFileItemViewProps extends IFileFieldItemViewProps, IMessageFile {
    isFileFromMessage?: boolean,
    isFileByAnotherUser?: boolean,
}

export default function ChatFileItemView(props: IChatFileItemViewProps) {
    const bem = useBem('ChatFileItemView');

    const isLoading = props.progress && props.progress.percent !== 100;

    const renderLink = useCallback(() => (
        <a
            className={bem.element('link')}
            title={props.title}
            href={props.error ? '#' : (props.url || props.item?.url)}
            target='blank'
        >
            {props.title}
        </a>
    ), [bem, props.title, props.error, props.url, props.item?.url]);

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
            </div>
        </div>
    ), [bem, props.title, renderProgressBar]);

    const renderFileItem = useCallback(() => (
        <div className={bem.element('left')}>
            <div className={bem.element('icon-wrapper')}>
                <Icon
                    className={bem.element('icon')}
                    name={(props.item?.fullHeight || props.fullHeight) ? 'img_box' : 'file_dock'}
                />
            </div>
            <div className={bem.element('content')}>
                <Text
                    type='boldSpan'
                    content={props.title}
                />
                {renderLink()}
                <Text
                    type='body2'
                    color='light'
                >
                    <FileSize
                        value={props.size}
                        showZero
                    />
                </Text>
            </div>
        </div>
    ), [bem, props.fullHeight, props.item?.fullHeight, props.size, props.title, renderLink]);

    return (
        <div
            className={bem.block({
                error: !props.isFileFromMessage && !!props.error,
                isFileFromMessage: props.isFileFromMessage,
                isFileForUploading: !props.isFileFromMessage,
                'another-user': !!props.isFileByAnotherUser,
            })}
        >
            {isLoading
                ? renderLoadingState()
                : renderFileItem()}
            {props.isFileFromMessage ? (
                <Icon
                    name='import'
                    className={bem.element('download')}
                    onClick={() => window.open(props.downloadUrl || props.url)}
                />
            ) : (
                <Icon
                    name={props.customRemoveIcon || 'cross_8x8'}
                    className={bem.element('remove', {isLoading})}
                    onClick={props.onRemove}
                />
            )}
        </div>
    );
}
