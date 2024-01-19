import * as React from 'react';
import {useCallback, useMemo} from 'react';
import _merge from 'lodash-es/merge';
import {useComponents} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../Field/fieldWrapper';

/**
 * HtmlField
 * Компонент для создания HTML-разметки, использующий WYSIWYG редактор
 */
export interface IHtmlFieldProps extends IFieldWrapperInputProps, IFieldWrapperOutputProps, IUiComponent {
    /**
     * Конфигурация wysiwyg реадактора
     */
    editorProps?: any,

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

    /**
     * Обработчик события при фокусе на редактора
     * @param event
     */
    onFocus?: (event: any) => any,

    /**
     * Обработчик события при снятии фокуса с редактора
     * @param event
     */
    onBlur?: (event: any) => any,

    [key: string]: any,
}

export interface IHtmlFieldViewProps extends IHtmlFieldProps {
    onChange: (event: any, editor: any) => void,
}

function HtmlField(props: IHtmlFieldProps): JSX.Element {
    const components = useComponents();

    const onFocus = useCallback((event) => {
        if (props.onFocus) {
            props.onFocus(event);
        }
    }, [props]);
    const onBlur = useCallback((event) => {
        if (props.onBlur) {
            props.onBlur(event);
        }
    }, [props]);
    const onChange = useCallback((event, editor) => {
        props.input.onChange(editor.getData());
    }, [props.input]);

    const {uploadUrl, uploadImagesProcessor} = props;

    const editorProps = useMemo(() => _merge(
        {
            image: {
                upload: {
                    types: ['jpeg', 'png', 'gif', 'jpg', 'svg'],
                },
            },
            simpleUpload: {
                uploadUrl: uploadUrl + (uploadImagesProcessor
                    ? '?imagesProcessor=' + uploadImagesProcessor
                    : ''),
            },
        },
        props.editorProps,
    ), [props.editorProps, uploadUrl, uploadImagesProcessor]);

    const viewProps = useMemo(() => ({
        onFocus,
        onBlur,
        onChange,
        editorProps,
        disabled: props.disabled,
        input: props.input,
    }), [editorProps, onBlur, onChange, onFocus, props.disabled, props.input]);

    return components.ui.renderView(props.view || 'form.HtmlFieldView', viewProps);
}

HtmlField.defaultProps = {
    disabled: false,
    className: '',
};

export default fieldWrapper<IHtmlFieldProps>('HtmlField', HtmlField);
