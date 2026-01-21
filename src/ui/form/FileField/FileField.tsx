import File from 'fileup-core/lib/models/File';
import _first from 'lodash-es/first';
import _values from 'lodash-es/values';
import {useEffect, useMemo, useRef, useState} from 'react';
import useFile, {IFileInput} from '../../../hooks/useFile';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {IButtonProps} from '../Button/Button';
import {FieldEnum} from '../../../enums';

export enum FilesLayout {
    list = 'list',
    wall = 'wall',
}

interface IFileFieldCommonProps extends IFileInput {
    /**
     * Показать значок удаление файла
     * @example true
     */
    showRemove?: boolean,

    /**
     * Кастомная иконка для удаление файла
     * @example true
     */
    customRemoveIcon?: string,

    /**
     * Вариант отображения файлов
     * @example 'list'
     */
    filesLayout?: FilesLayout | string,

    /**
     * Текст, который отобразится при загрузке файла
     * @example 'Loading...'
     */
    loadingText?: string,
}

/**
 * FileField
 *
 * Компонент `FileField` представляет собой поле формы для загрузки файлов.
 * Он использует хук `useFile` для управления состоянием файлов и выполнения операций с файлами, таких как выбор и удаление.
 * Компонент поддерживает различные варианты отображения файлов (список или стена) с помощью перечисления `FilesLayout`.
 * На backendUrl по дефолту файл отправляется в теле запроса в виде бинарного кода.
 * Чтобы отправлять файл в виде form-data (например в таком виде принимает файл FileModule в библиотеке steroidsjs/nest),
 * нужно передать в `FileField` пропс uploaderConfig, в котором нужно указать поле useFormData: true.
 **/

export interface IFileFieldProps extends IFieldWrapperInputProps, IFileFieldCommonProps, IUiComponent {
    /**
     * View компонент для кнопки
     * @example true
     */
    buttonView?: any,

    /**
     * Пропсы для кнопки
     * @example true
     */
    buttonProps?: IButtonProps,

    /**
     * View компонент для элемента списка файлов
     * @example true
     */
    itemView?: CustomView,

    /**
     * Пропсы для элемента файла
     * @example true
     */
    itemProps?: Record<string, any>,

    hasDropArea?: boolean,

    [key: string]: any,
}

export interface IFileFieldItemViewProps extends IFileFieldCommonProps {
    /**
     * Уникальный текстовый идентификатор
     * @example e65f5867-0083-48a7-af43-1121ed9e6280
     */
    uid?: string,

    /**
     * ID файла
     * @example 34
     */
    fileId?: number | string,

    /**
     * Исходное название файла
     * @example original-name
     */
    title?: string,
    disabled?: boolean,

    /**
     * Обработчик события удаления файла
     * @param e
     */
    onRemove?: () => void,
    error?: string,
    size?: number,
    item?: Record<string, any>,
    image?: {
        /**
         * Url файла
         * @example assets/file.txt
         */
        url: string,

        /**
         * Ширина
         * @example 1280
         */
        width: string,

        /**
         * Высота
         * @example 720
         */
        height: string,
    },
    /**
     * Обработчик события загрузки файлов
     * @param e
     */
    onLoad?: () => void,
    progress?: {
        bytesUploaded: number,
        percent: number,
    },
}

export interface IFileFieldViewProps extends IFileFieldProps {
    items: IFileFieldItemViewProps[],
}

const FILE_STATUS_END = 'end';

function FileFieldComponent(props: IFileFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();
    const dropRef = useRef<HTMLDivElement>(null);

    const {files, onBrowse, onRemove, uploader} = useFile({
        ...props,
        dropRef: props.hasDropArea ? dropRef : null,
    });

    const [isFilesLoaded, setIsFilesLoaded] = useState(false);

    const FileFieldView = props.view || components.ui.getView('form.FileFieldView');
    const FileFieldItemView = props.itemView || components.ui.getView('form.FileFieldItemView');

    useEffect(() => {
        setIsFilesLoaded(files.filter(file => file._status === FILE_STATUS_END).length === files.length);
    }, [files]);

    useEffect(() => {
        if (isFilesLoaded && props.onLoad) {
            props.onLoad();
        }
    }, [isFilesLoaded, props]);

    useEffect(() => {
        if (props.onChange) {
            props.onChange(files);
        }
    }, [files, props]);

    const viewProps = useMemo(() => ({
        input: props.input,
        buttonView: props.buttonView,
        multiple: props.multiple,
        imagesOnly: props.imagesOnly,
        buttonProps: {
            label: props.filesLayout === FilesLayout.wall
                ? __('Upload')
                : __('Click to Upload'),
            size: props.size,
            disabled: props.disabled,
            onClick: onBrowse,
            ...props.buttonProps,
        },
        itemView: FileFieldItemView,
        filesLayout: props.filesLayout,
        className: props.className,
        itemProps: props.itemProps,
        loadingText: props.loadingText,
        dropRef,
        uploader,
        hasDropArea: props.hasDropArea,
        items: files.map(file => {
            const data = file.getResultHttpMessage() || {};
            const item = {
                uid: file.getUid(),
                fileId: data.id || null,
                title: file.getName(),
                size: data.size || data.fileSize,
                disabled: props.disabled,
                showRemove: props.showRemove,
                onRemove: () => onRemove(file),
                error: null,
                image: null,
                progress: null,
                item: data,
            };
            // Add error
            if (file.getResult() === File.RESULT_ERROR) {
                if (typeof file.getResultHttpMessage() === 'string'
                    && file.getResultHttpMessage().substr(0, 1) === '{') {
                    const errorResponse = JSON.parse(file.getResultHttpMessage());
                    item.error = errorResponse.error || errorResponse.message || __('Ошибка');
                } else {
                    item.error = file.getResultHttpMessage()
                        ? JSON.stringify(file.getResultHttpMessage())
                        : __('Ошибка');
                }
            }
            // Add thumbnail image
            if (props.imagesOnly && data.images) {
                // Image object has properties: url, width, height
                item.image = data.images[props.imagesProcessor]
                    || _first(_values(data.images));
            }
            // Add progress
            if (file.getStatus() === File.STATUS_PROCESS) {
                item.progress = {
                    bytesUploaded: file.getBytesUploaded(),
                    percent: file.progress.getPercent(),
                };
            }
            return item;
        }),
        // eslint-disable-next-line max-len
    }), [FileFieldItemView, files, onBrowse, onRemove, props.buttonProps, props.buttonView, props.className, props.disabled, props.filesLayout, props.hasDropArea, props.imagesOnly, props.imagesProcessor, props.input, props.itemProps, props.loadingText, props.multiple, props.showRemove, props.size, uploader]);

    return (
        <FileFieldView {...viewProps} />
    );
}
function FileField(props: IFileFieldProps & IFieldWrapperOutputProps): JSX.Element {
    if (process.env.IS_SSR) {
        return null;
    }

    return (
        <FileFieldComponent {...props} />
    );
}

FileField.defaultProps = {
    disabled: false,
    required: false,
    filesLayout: FilesLayout.list,
    className: '',
    showRemove: true,
    buttonProps: {
        color: 'basic',
        outline: true,
    },
    multiple: false,
    hasDropArea: false,
};

export default fieldWrapper<IFileFieldProps>(FieldEnum.FILE_FIELD, FileField);
