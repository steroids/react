import * as React from 'react';
import _merge from 'lodash-es/merge';
import File from 'fileup-core/lib/models/File';
import XhrUploader from 'fileup-core/lib/uploaders/XhrUploader';
import _get from 'lodash/get';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

interface IHtmlFieldProps {
    label?: string | boolean;
    hint?: string;
    attribute?: string;
    input?: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    };
    required?: boolean;
    disabled?: boolean;
    editorProps?: any;
    onChange?: (...args: any[]) => any;
    className?: string;
    uploadUrl?: string;
    uploadImagesProcessor?: string;
    view?: any;
    getView?: any;
    ui?: any;
}

@fieldHoc({
    componentId: 'form.HtmlField'
})
@components('ui')
export default class HtmlField extends React.PureComponent<IHtmlFieldProps,
    {}> {
    static defaultProps = {
        disabled: false,
        className: ""
    };
    static defaultEditorConfig = {
        modules: {
            toolbar: [
                [{header: [2, 3, false]}],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [
                    {list: 'ordered'},
                    {list: 'bullet'},
                    {indent: '-1'},
                    {indent: '+1'}
                ],
                ['link', 'image', 'video'],
                ['clean']
            ]
        },
        formats: [
            'header',
            'bold',
            'italic',
            'underline',
            'strike',
            'blockquote',
            'list',
            'bullet',
            'indent',
            'link',
            'video',
            'image'
        ]
    };

    render() {
        const HtmlFieldView =
            this.props.view || this.props.ui.getView('form.HtmlFieldView');
        return (
            <HtmlFieldView
                {...this.props}
                editorProps={_merge(
                    HtmlField.defaultEditorConfig,
                    {
                        modules: {
                            imageUploader: {
                                upload: nativeFile => {
                                    return new Promise(resolve => {
                                        const file = new File({
                                            index: 0,
                                            native: nativeFile,
                                            path: nativeFile.name,
                                            type: nativeFile.type || "",
                                            bytesTotal: nativeFile.fileSize || nativeFile.size || 0
                                        });
                                        const uploader = new XhrUploader({
                                            url:
                                                this.props.uploadUrl +
                                                (this.props.uploadImagesProcessor
                                                    ? '?imagesProcessor=' +
                                                    this.props.uploadImagesProcessor
                                                    : ""),
                                            file
                                        });
                                        file.setUploader(uploader);
                                        uploader.on(XhrUploader.EVENT_END, () => {
                                            const processor =
                                                this.props.uploadImagesProcessor || 'default';
                                            resolve(
                                                _get(file.getResultHttpMessage(), [
                                                    'images',
                                                    processor,
                                                    'url'
                                                ])
                                            );
                                        });
                                        uploader.start();
                                    });
                                }
                            }
                        }
                    },
                    this.props.editorProps,
                    {
                        value: this.props.input.value || "",
                        onChange: value => this.props.input.onChange(value)
                    }
                )}
            />
        );
    }
}
