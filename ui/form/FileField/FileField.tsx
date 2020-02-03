import * as React from 'react';
import _first from 'lodash-es/first';
import _values from 'lodash-es/values';
import File from 'fileup-core/lib/models/File';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';
import fileHoc from '../fileHoc';

interface IFileFieldProps {
    label?: string | boolean;
    hint?: string;
    attribute?: string;
    input?: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    };
    required?: boolean;
    size?: 'sm' | 'md' | 'lg';
    buttonComponent?: React.ReactNode;
    buttonProps?: any;
    backendUrl?: string;
    showRemove?: boolean;
    imagesOnly?: boolean;
    multiple?: boolean;
    imagesProcessor?: string;
    imagesExactSize?: number[];
    mimeTypes?: string[];
    files?: any[];
    disabled?: boolean;
    onChange?: (...args: any[]) => any;
    className?: string;
    view?: any;
    itemView?: any;
    itemProps?: any;
    onBrowse?: (...args: any[]) => any;
    onRemove?: (...args: any[]) => any;
    map?: any;
    getView?: any;
    ui?: any;
}

@fieldHoc({
    componentId: 'form.FileField'
})
@fileHoc()
@components('ui')
export default class FileField extends React.PureComponent<IFileFieldProps,
    {}> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: "",
        showRemove: true,
        buttonProps: {
            color: 'secondary',
            outline: true
        }
    };

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
                    ...FileField.defaultProps.buttonProps,
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
                        item.error = file.getResultHttpMessage().error;
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
