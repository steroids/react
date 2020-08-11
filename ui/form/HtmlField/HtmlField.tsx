import * as React from 'react';
import _merge from 'lodash-es/merge';
import File from 'fileup-core/lib/models/File';
import XhrUploader from 'fileup-core/lib/uploaders/XhrUploader';
import _get from 'lodash-es/get';
import {components, field} from '../../../hoc';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';
import {convertToRaw, ContentState, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export interface IHtmlFieldProps extends IFieldHocInput {

    /**
     * Конфигурация wysiwyg реадактора
     */
    editorProps?: any,
    className?: CssClassName,

    /**
     * Url на который будет отправлена форма загрузки файла
     * @example /api/v1/upload-files
     */
    uploadUrl?: string,

    /**
     * После загрузки изображения на сервер,
     * можно указать с каким процессором должно вернуться картинка
     * @example origin
     */
    uploadImagesProcessor?: string,
    view?: CustomView,

    /**
     * Обработчик события при фокусе на редактора
     * @param event
     */
    onFocus?: (event: any) => any,

    /**
     * Обработчик события при снятии фокуса с редактора
     * @param event
     * @param editorState
     */
    onBlur?: (event, editorState) => any,

    /**
     * Пользовательские кнопки
     * @example [<CustomButton/>]
     */
    customButtons?: Array<any>,
}

export interface IHtmlFieldViewProps extends IHtmlFieldProps, IFieldHocOutput {
    editorState?: any,
    onEditorStateChange?: (state: any) => void,
}

interface IHtmlFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {

}

interface IHtmlStateProps {
    editorState?: any,
}

@field({
    componentId: 'form.HtmlField'
})
@components('ui')
export default class HtmlField extends React.PureComponent<IHtmlFieldProps & IHtmlFieldPrivateProps, IHtmlStateProps> {

    constructor(props) {
        super(props);
        const html = this.props.input.value || '';
        const contentBlock = htmlToDraft(html);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
            editorState: editorState,
        };
    }

    onEditorStateChange: Function = (editorState) => {
        this.setState({
            editorState: editorState,
        });
    };

    static defaultProps = {
        disabled: false,
        className: '',
        customButtons: [],
        onFocus: () => {},
        onBlur: () => {},
    };

    static defaultEditorConfig = {
        options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
        inline: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
            bold: {className: undefined},
            italic: {className: undefined},
            underline: {className: undefined},
            strikethrough: {className: undefined},
            monospace: {className: undefined},
            superscript: {className: undefined},
            subscript: {className: undefined},
        },
        blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
        },
        fontSize: {
            options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
        },
        fontFamily: {
            options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
        },
        list: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['unordered', 'ordered', 'indent', 'outdent'],
            unordered: {className: undefined},
            ordered: {className: undefined},
            indent: {className: undefined},
            outdent: {className: undefined},
        },
        textAlign: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['left', 'center', 'right', 'justify'],
            left: {className: undefined},
            center: {className: undefined},
            right: {className: undefined},
            justify: {className: undefined},
        },
        colorPicker: {
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
        },
        link: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            dropdownClassName: undefined,
            showOpenOptionOnHover: true,
            defaultTargetOption: '_self',
            options: ['link', 'unlink'],
            link: {className: undefined},
            unlink: {className: undefined},
            linkCallback: undefined
        },
        embedded: {
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            embedCallback: undefined,
            defaultSize: {
                height: 'auto',
                width: 'auto',
            },
        },
        image: {
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: true,
            uploadCallback: undefined,
            previewImage: false,
            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            alt: {present: false, mandatory: false},
            defaultSize: {
                height: 'auto',
                width: 'auto',
            },
        },
        remove: {className: undefined, component: undefined},
        history: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['undo', 'redo'],
            undo: {className: undefined},
            redo: {className: undefined},
        },
    };

    render() {
        const {uploadUrl, uploadImagesProcessor} = this.props;
        const HtmlFieldView = this.props.view || this.props.ui.getView('form.HtmlFieldView');
        return (
            <HtmlFieldView
                toolbarCustomButtons={this.props.customButtons}
                onFocus={(event) => this.props.onFocus(event)}
                onBlur={(event, editorState) => this.props.onBlur(event, editorState)}
                editorState={this.state.editorState}
                onEditorStateChange={editorState => {
                    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
                    this.onEditorStateChange(editorState)
                    this.props.input.onChange(html)
                }}
                {...this.props}
                editorProps={_merge(
                    HtmlField.defaultEditorConfig,
                    {
                        image: {
                            urlEnabled: true,
                            uploadEnabled: true,
                            alignmentEnabled: true,
                            uploadCallback: nativeFile => {
                                return new Promise(resolve => {
                                    const file = new File({
                                        index: 0,
                                        native: nativeFile,
                                        path: nativeFile.name,
                                        type: nativeFile.type || '',
                                        bytesTotal: nativeFile.fileSize || nativeFile.size || 0
                                    });
                                    const uploader = new XhrUploader({
                                        url:
                                            uploadUrl +
                                            (uploadImagesProcessor
                                                    ? '?imagesProcessor=' + uploadImagesProcessor
                                                    : ''
                                            ),
                                        file
                                    });
                                    file.setUploader(uploader);
                                    uploader.on(XhrUploader.EVENT_END, () => {
                                        const processor = uploadImagesProcessor || 'default';
                                        const url = _get(file.getResultHttpMessage(), [
                                            'images',
                                            processor,
                                            'url'
                                        ]);
                                        resolve({
                                            data: {
                                                url: url
                                            }
                                        })
                                    });
                                    uploader.start();
                                })
                            },
                            previewImage: true,
                            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                            alt: {present: false, mandatory: false},
                            defaultSize: {
                                height: 'auto',
                                width: 'auto',
                            },
                        },
                    },
                    this.props.editorProps,
                )}
            />
        );
    }
}
