import * as React from 'react';
import File from 'fileup-core/lib/models/File';
import _first from 'lodash-es/first';
import _values from 'lodash-es/values';
import {IFileHocInput, IFileHocOutput} from '../../../hoc/file';
import useFile from '../../../hooks/useFile';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

export enum FilesLayout {
    list = 'list',
    wall = 'wall',
}

export interface IFileFieldProps extends IFieldWrapperInputProps, IFileHocInput, IFileHocOutput {

    /**
     * Показать значок удаление файла
     * @example true
     */
    showRemove?: boolean,
    buttonView?: React.ReactNode;
    buttonProps?: any;
    className?: CssClassName;
    view?: CustomView;
    itemView?: CustomView;
    itemProps?: any;

    /**
     * Вариант отображения файлов
     * @example 'list'
     */
    filesLayout?: FilesLayout;

    [key: string]: any;
}

export interface IFileFieldItemViewProps extends IFileHocInput, IFileHocOutput {
    /**
     * Уникальный текстовый идентификатор
     * @example e65f5867-0083-48a7-af43-1121ed9e6280
     */
    uid?: string,

    imagesOnly?: boolean,

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
    showRemove?: boolean,
    layout?: FilesLayout,

    /**
     * Обработчик события удаления файла
     * @param e
     */
    onRemove?: () => void,
    error?: string,
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
    progress?: {
        bytesUploaded: number,
        percent: number,
    },
}

export interface IFileFieldViewProps extends IFileFieldProps {
    buttonView?: React.ReactNode | any;
    imagesOnly?: boolean;
    itemProps?: any;
    buttonProps: {
        /**
         * Название поля
         * @example Save
         */
        label?: string | any,
        size?: boolean,

        /**
         * Переводит в неактивное состояние
         * @example true
         */
        disabled?: boolean,

        /**
         * Обработчик события нажатия
         * @param e
         */
        onClick?: (e: Event) => void,
    },
    itemView?: React.ReactNode | any;
    items: IFileFieldItemViewProps[]
}

function FileField(props: IFileFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();
    const {files, onBrowse, onRemove} = useFile(props);

    const FileFieldView = props.view || components.ui.getView('form.FileFieldView');
    const FileFieldItemView = props.itemView || components.ui.getView('form.FileFieldItemView');
    return (
        <FileFieldView
            {...props}
            buttonView={props.buttonView}
            buttonProps={{
                label: props.filesLayout === FilesLayout.wall
                    ? __('Upload')
                    : __('Click to Upload'),
                size: props.size,
                disabled: props.disabled,
                onClick: onBrowse,
                ...props.buttonProps,
            }}
            itemView={FileFieldItemView}
            items={files.map(file => {
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
                if (data.images) {
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
            })}
        />
    );
}

FileField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    showRemove: true,
    buttonProps: {
        color: 'basic',
        outline: true,
    },
    multiple: false,
};

export default fieldWrapper<IFileFieldProps>('FileField', FileField);
