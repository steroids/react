import {useEffect} from 'react';
import {useMount, useUnmount, useUpdate, usePrevious} from 'react-use';
import FileUp from 'fileup-core';
import File from 'fileup-core/lib/models/File';
import QueueCollection from 'fileup-core/lib/models/QueueCollection';
import _get from 'lodash-es/get';
import _isEqual from 'lodash-es/isEqual';
import _difference from 'lodash-es/difference';
import buildURL from 'axios/lib/helpers/buildURL';
import {IFileHocInput, IFileHocOutput} from '../hoc/file';
import useInitial from '../hooks/useInitial';
import {useForm} from '../hooks/index';

const imagesMimeTypes = [
    'image/gif',
    'image/jpeg',
    'image/pjpeg',
    'image/png',
];

function generateBackendUrl(props) {
    return buildURL(props.backendUrl, {
        mimeTypes: props.imagesOnly ? imagesMimeTypes : props.mimeTypes,
        imagesProcessor: props.imagesProcessor,
        imagesExactSize: props.imagesExactSize,
    });
}

export default function useFile(props: IFileHocInput): IFileHocOutput {
    const uploader = useInitial(() => new FileUp({
        dropArea: {},
        backendUrl: generateBackendUrl(props),
        uploaderConfig: {
            ...props.uploaderConfig,
        },
        ...props.uploader,
        form: {
            ...(props.uploader && props.uploader.form),
            multiple: props.multiple,
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
        initialFiles = form.formSelector(state => _get(state, ['values', props.input.name.replace(/Ids?$/, '')]));
    }
    useEffect(() => {
        if (initialFiles) {
            uploader.queue.add(
                [].concat(initialFiles || [])
                    .filter(item => !!item.uid)
                    .map(
                        item => new File({
                            path: item.title || item.label || item.uid || item.id,
                            status: File.STATUS_END,
                            result: File.RESULT_SUCCESS,
                            resultHttpStatus: 200,
                            resultHttpMessage: {
                                id: item.id || item.uid,
                                images: item.thumbnailUrl
                                    ? [{url: item.thumbnailUrl}]
                                    : null,
                            },
                            uid: item.uid,
                        }),
                    ),
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
    const onQueueItemEnd = (file) => {
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
    };

    /**
     * Triggered by queue when file is removed from it
     * @param {File[]} removedFiles
     * @private
     */
    const onQueueRemove = (removedFiles) => {
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
    };

    useMount(() => {
        uploader.queue.on(
            QueueCollection.EVENT_ITEM_STATUS,
            forceUpdate,
        );
        uploader.queue.on(
            QueueCollection.EVENT_ITEM_PROGRESS,
            forceUpdate,
        );
        uploader.queue.on(
            QueueCollection.EVENT_ITEM_END,
            onQueueItemEnd,
        );
        uploader.queue.on(
            QueueCollection.EVENT_REMOVE,
            onQueueRemove,
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
        uploader.queue.off(
            QueueCollection.EVENT_ITEM_END,
            onQueueItemEnd,
        );
        uploader.queue.off(
            QueueCollection.EVENT_REMOVE,
            onQueueRemove,
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
                [].concat(props.input.value || []),
                [].concat(prevInputValue || []),
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
    }, [prevInputValue]);

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
