import React from 'react';
import PropTypes from 'prop-types';
import _first from 'lodash-es/first';
import _values from 'lodash-es/values';
import File from 'fileup-core/lib/models/File';

import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';
import fileHoc from '../fileHoc';

@fieldHoc({
    componentId: 'form.FileField',
})
@fileHoc()
@components('ui')
export default class FileField extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        hint: PropTypes.string,
        attribute: PropTypes.string,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        required: PropTypes.bool,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        buttonComponent: PropTypes.node,
        buttonProps: PropTypes.object,
        backendUrl: PropTypes.string,
        showRemove: PropTypes.bool,
        imagesOnly: PropTypes.bool,
        multiple: PropTypes.bool,
        imagesProcessor: PropTypes.string,
        imagesExactSize: PropTypes.arrayOf(PropTypes.number),
        mimeTypes: PropTypes.arrayOf(PropTypes.string),
        files: PropTypes.arrayOf(PropTypes.object),
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        className: PropTypes.string,
        view: PropTypes.elementType,
        itemView: PropTypes.elementType,
        itemProps: PropTypes.object,
        onBrowse: PropTypes.func,
        onRemove: PropTypes.func,
    };

    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        showRemove: true,
        buttonProps: {
            color: 'secondary',
            outline: true,
        },
    };

    render() {
        const FileFieldView = this.props.view || this.props.ui.getView('form.FileFieldView');
        const FileFieldItemView = this.props.itemView || this.props.ui.getView('form.FileFieldItemView');
        return (
            <FileFieldView
                {...this.props}
                buttonComponent={this.props.buttonComponent}
                buttonProps={{
                    label: this.props.imagesOnly
                        ? (this.props.multiple ? __('Прикрепить фотографии') : __('Прикрепить фото'))
                        : (this.props.multiple ? __('Прикрепить файлы') : __('Прикрепить файл')),
                    size: this.props.size,
                    disabled: this.props.disabled,
                    onClick: this.props.onBrowse,
                    ...FileField.defaultProps.buttonProps,
                    ...this.props.buttonProps,
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
                        progress: null,
                    };

                    // Add error
                    if (file.getResult() === File.RESULT_ERROR) {
                        item.error = file.getResultHttpMessage().error;
                    }

                    // Add thumbnail image
                    if (data.images) {
                        // Image object has properties: url, width, height
                        item.image = data.images[this.props.imagesProcessor] || _first(_values(data.images));
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

}
