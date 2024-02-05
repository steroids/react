import {useCallback, useEffect} from 'react';
import {useMount, useUnmount, useUpdate, usePrevious} from 'react-use';
import FileUp from 'fileup-core';
import File from 'fileup-core/lib/models/File';
import QueueCollection from 'fileup-core/lib/models/QueueCollection';
import _get from 'lodash-es/get';
import _isEqual from 'lodash-es/isEqual';
import _difference from 'lodash-es/difference';
import buildURL from 'axios/lib/helpers/buildURL';
import useInitial from './useInitial';
import {useComponents, useForm} from './index';

export interface IFileInput {
    /**
    * Параметры для input элемента
    */
    input?: FormInputType,

    /**
    * Множественный выбор файлов
    */
    multiple?: boolean,

    /**
    * Позволяет указать uploader
    */
    uploader?: any,

    /**
     * Экшен для отправки на бэкенд
     * @example '/api/v1/user/avatar/crop'
     */
    backendUrl?: string,

    /**
    * Список mime-типов
    */
    mimeTypes?: string[],

    /**
    * Использовать только изображения
    */
    imagesOnly?: boolean,
    imagesProcessor?: string,

    /**
    * Точные размеры изображений
    */
    imagesExactSize?: boolean,

    /**
    * Начальные файлы
    */
    initialFiles?: any,

    /**
    * Параметры для uploader
    */
    uploaderConfig?: {
        useFormData?: boolean,
        fileFieldName?: string,
    } | any,
}

export interface IFileOutput {
    uploader?: any,
    files?: any[],
    onBrowse?: any,
    onRemove?: any,
    onAdd?: any,
}

const imagesMimeTypes = [
    'image/gif',
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/heif',
    'image/heic',
    'image/heif-sequence',
    'image/heic-sequence',
];

export function generateBackendUrl(props) {
    return buildURL(props.backendUrl, {
        mimeTypes: props.imagesOnly ? imagesMimeTypes : props.mimeTypes,
        imagesProcessor: props.imagesProcessor,
        imagesExactSize: props.imagesExactSize,
    });
}

export default function useFile(props: IFileInput): IFileOutput {
    const {http} = useComponents();
    http.getAccessToken(); // TODO Run promise..

    const uploader = useInitial(() => new FileUp({
        dropArea: {},
        backendUrl: generateBackendUrl(props),
        uploaderConfig: {
            ...props.uploaderConfig,
            headers: {
                ...props.uploaderConfig?.headers,
                Authorization: 'Bearer ' + http._accessToken, // TODO how to get access token wuthout promise?
            },
        },
        ...props.uploader,
        form: {
            ...(props.uploader && props.uploader.form),
            multiple: props.multiple,
            accept: props.imagesOnly ? imagesMimeTypes.join(', ') : '',
        },
    }));

    /**
     * Force component update when file status or progress changes
     * @private
     */
    const forceUpdate = useUpdate();

    // Check for initial files
    const form = useForm();
    let initialFiles = props.initialFiles;
    if (!initialFiles) {
        // Find in form values
        initialFiles = form.formSelector(state => _get(state, 'values.' + props.input.name.replace(/Ids?$/, '')));
    }
    useEffect(() => {
        if (initialFiles) {
            const normalizedInitialFiles = [].concat(initialFiles || [])
                .filter(item => !!item.uid);

            // Remove not exists
            const toDelete = uploader.queue.getFiles()
                .filter(file => !normalizedInitialFiles.find(item => item.uid === file.getUid()));
            if (toDelete.length > 0) {
                uploader.queue.remove(toDelete);
            }

            // Add or update
            uploader.queue.add(
                normalizedInitialFiles
                    .map(item => {
                        const path = item.title || item.label || item.uid || item.id;
                        const resultHttpMessage = {
                            ...item,
                            id: item.id || item.uid,
                            images: item.thumbnailUrl
                                ? [{url: item.thumbnailUrl}]
                                : null,
                        };

                        const file = uploader.queue.getByUid(item.uid);
                        if (file) {
                            file.setPath(path);
                            file.setResultHttpMessage(resultHttpMessage);
                            return false;
                        }

                        return new File({
                            path,
                            status: File.STATUS_END,
                            result: File.RESULT_SUCCESS,
                            resultHttpStatus: 200,
                            resultHttpMessage,
                            uid: item.uid,
                        });
                    })
                    .filter(Boolean),
            );

            forceUpdate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialFiles]);

    /**
     * Trigger by queue when file is uploaded or error
     * @param {File} file
     * @private
     */
    const onQueueItemEnd = useCallback((file) => {
        forceUpdate();
        // Check successfully
        if (file.getResult() !== File.RESULT_SUCCESS) {
            return;
        }
        // Check file id exists
        const id = _get(file.getResultHttpMessage(), 'id');
        if (!id) {
            return;
        }
        // Update value
        if (props.multiple) {
            props.input.onChange(
                [].concat(props.input.value || []).concat([id]),
            );
        } else {
            props.input.onChange(id);
        }
    }, [forceUpdate, props.input, props.multiple]);
    const prevOnQueueItemEnd = usePrevious(onQueueItemEnd);
    useEffect(() => {
        if (prevOnQueueItemEnd) {
            uploader.queue.off(
                QueueCollection.EVENT_ITEM_END,
                prevOnQueueItemEnd,
            );
        }
        uploader.queue.on(
            QueueCollection.EVENT_ITEM_END,
            onQueueItemEnd,
        );
    }, [onQueueItemEnd, prevOnQueueItemEnd, uploader.queue]);
    useUnmount(() => {
        uploader.queue.off(
            QueueCollection.EVENT_ITEM_END,
            onQueueItemEnd,
        );
    });

    /**
     * Triggered by queue when file is removed from it
     * @param {File[]} removedFiles
     * @private
     */
    const onQueueRemove = useCallback((removedFiles) => {
        const toRemove = removedFiles
            .map(file => _get(file.getResultHttpMessage(), 'id'))
            .filter(Boolean);
        if (toRemove.length === 0) {
            return;
        }
        // Update value
        if (props.multiple) {
            props.input.onChange(
                []
                    .concat(props.input.value || [])
                    .filter(id => toRemove.indexOf(Number(id)) === -1),
            );
        } else if (toRemove.indexOf(props.input.value) !== -1) {
            props.input.onChange(null);
        }
        forceUpdate();
    }, [forceUpdate, props.input, props.multiple]);
    const prevOnQueueRemove = usePrevious(onQueueRemove);
    useEffect(() => {
        if (prevOnQueueRemove) {
            uploader.queue.off(
                QueueCollection.EVENT_REMOVE,
                prevOnQueueRemove,
            );
        }
        uploader.queue.on(
            QueueCollection.EVENT_REMOVE,
            onQueueRemove,
        );
    }, [onQueueRemove, prevOnQueueRemove, uploader.queue]);
    useUnmount(() => {
        uploader.queue.off(
            QueueCollection.EVENT_REMOVE,
            onQueueRemove,
        );
    });

    useMount(() => {
        uploader.queue.on(
            QueueCollection.EVENT_ITEM_STATUS,
            forceUpdate,
        );
        uploader.queue.on(
            QueueCollection.EVENT_ITEM_PROGRESS,
            forceUpdate,
        );
    });

    useUnmount(() => {
        uploader.queue.off(
            QueueCollection.EVENT_ITEM_STATUS,
            forceUpdate,
        );
        uploader.queue.off(
            QueueCollection.EVENT_ITEM_PROGRESS,
            forceUpdate,
        );
    });

    // Check backend url changes
    useEffect(() => {
        uploader.backendUrl = generateBackendUrl({
            backendUrl: props.backendUrl,
            imagesOnly: props.imagesOnly,
            mimeTypes: props.mimeTypes,
            imagesProcessor: props.imagesProcessor,
            imagesExactSize: props.imagesExactSize,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.backendUrl, props.imagesExactSize, props.imagesOnly, props.imagesProcessor, props.mimeTypes]);

    // Check multiple flag update
    useEffect(() => {
        uploader.form.multiple = props.multiple;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.multiple]);

    // TODO Check uploader config update
    //useEffect(() => {
    //    _merge(uploader, props.uploader);
    //}, [props.uploader, uploader]);

    // Check remove keys from value
    const prevInputValue = usePrevious(props.input.value);

    //todo refactoring
    useEffect(() => {
        if (prevInputValue && !_isEqual(prevInputValue !== props.input.value)) {
            const toRemove = _difference(
                [].concat(prevInputValue || []),
                [].concat(props.input.value || []),
            );
            if (toRemove.length > 0) {
                uploader.queue.remove(
                    uploader.queue.getFiles().filter(file => (
                        toRemove.indexOf(_get(file.getResultHttpMessage(), 'id')) !== -1
                    )),
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prevInputValue, props.input.value]);

    /**
     * Show browse dialog in user browser
     * @param {object} event
     * @private
     */
    const onBrowse = (event) => {
        if (event) {
            event.preventDefault();
        }
        uploader.browse();
    };

    /**
     * Remove selected file from uploader
     * @param {File} fileToRemove
     */
    const onRemove = fileToRemove => {
        uploader.queue.remove([fileToRemove]);
        forceUpdate();
    };

    const files = [].concat(uploader.queue.getFiles());

    /**
     * Add file to uploader
     * @param {File} newFile
     */
    const onAdd = (newFile: File) => {
        if (!props.multiple) {
            uploader.queue.remove(files);
        }

        uploader.queue.add([newFile]);
        forceUpdate();
    };

    return {
        uploader,
        files,
        onBrowse,
        onRemove,
        onAdd,
    };
}
