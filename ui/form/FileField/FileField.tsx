import * as React from 'react';
import _first from 'lodash-es/first';
import _values from 'lodash-es/values';
import File from 'fileup-core/lib/models/File';
import {components, field, file} from '../../../hoc';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IFileHocInput, IFileHocOutput} from '../../../hoc/file';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IFileFieldProps extends IFieldHocInput, IFileHocInput {

    /**
     * Показать значок удаление файла
     * @example true
     */
    showRemove?: boolean,
    buttonComponent?: React.ReactNode; // TODO May be buttonView ?
    buttonProps?: any;
    className?: CssClassName;
    view?: CustomView;
    itemView?: CustomView;
    itemProps?: any;
    [key: string]: any;
}

interface IFileFieldItemProps extends IFieldHocOutput, IFileHocOutput {
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

export interface IFileFieldItemViewProps extends IFileFieldItemProps {

}

export interface IFileFieldViewProps extends IFieldHocOutput, IFileHocOutput {
    buttonComponent?: React.ReactNode | any;
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
    items: IFileFieldItemProps[]
}

interface IFileFieldPrivateProps extends IFieldHocOutput, IFileHocOutput, IComponentsHocOutput {

}

const defaultProps = {
    disabled: false,
    required: false,
    className: '',
    showRemove: true,
    buttonProps: {
        color: 'secondary',
        outline: true
    }
};

@field({
    componentId: 'form.FileField'
})
@file()
@components('ui')
export default class FileField extends React.PureComponent<IFileFieldProps & IFileFieldPrivateProps> {

    static defaultProps = defaultProps;

    render() {
        const FileFieldView =
            this.props.view || this.props.ui.getView('form.FileFieldView');
        const FileFieldItemView =
            this.props.itemView || this.props.ui.getView('form.FileFieldItemView');
        return (
            <FileFieldView
                {...this.props}
                buttonComponent={this.props.buttonComponent}
                buttonProps={{
                    label: this.props.imagesOnly
                        ? this.props.multiple
                            ? __('Прикрепить фотографии')
                            : __('Прикрепить фото')
                        : this.props.multiple
                            ? __('Прикрепить файлы')
                            : __('Прикрепить файл'),
                    size: this.props.size,
                    disabled: this.props.disabled,
                    onClick: this.props.onBrowse,
                    ...defaultProps.buttonProps,
                    ...this.props.buttonProps
                }}
                itemView={FileFieldItemView}
                items={this.props.files.map(file => {
                    const data = file.getResultHttpMessage() || {};
                    const item = {
                        uid: file.getUid(),
                        fileId: data.id || null,
                        title: file.getName(),
                        size: this.props.size,
                        disabled: this.props.disabled,
                        showRemove: this.props.showRemove,
                        onRemove: () => this.props.onRemove(file),
                        error: null,
                        image: null,
                        progress: null
                    };
                    // Add error
                    if (file.getResult() === File.RESULT_ERROR) {
                        item.error = file.getResultHttpMessage()?.error;
                    }
                    // Add thumbnail image
                    if (data.images) {
                        // Image object has properties: url, width, height
                        item.image =
                            data.images[this.props.imagesProcessor] ||
                            _first(_values(data.images));
                    }
                    // Add progress
                    if (file.getStatus() === File.STATUS_PROCESS) {
                        item.progress = {
                            bytesUploaded: file.getBytesUploaded(),
                            percent: file.progress.getPercent()
                        };
                    }
                    return item;
                })}
            />
        );
    }
}
