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
 * Компонент для создания HTML-разметки, использующий WYSIWYG редактор.
 *
 * Для использования WYSIWYG редактора, необходимо установить в проекте зависимости `@ckeditor/ckeditor5-react` и `@steroidsjs/ckeditor5`,
 * затем импортировать `CKEditor` из `@ckeditor/ckeditor5-react` и `ClassicEditor` из `@steroidsjs/ckeditor5/packages/ckeditor5-build-classic`.
 * Компонент `CKEditor` нужно передать в проп `htmlComponent`, а конструктор `ClassicEditor` в проп `editorConstructor`.
 *
 * При передаче `HtmlField` с бэкенда, необходимо переопределить `view` компонента, указав локальный.
 * В локальном компоненте добавить вместо пропсов `htmlComponent` и `editorConstructor` импорты `CKEditor` и `ClassicEditor` соотвественно.
 */
export interface IHtmlFieldProps extends IFieldWrapperInputProps, IFieldWrapperOutputProps, IUiComponent {
    /**
     * Компонент редактора 'ckeditor5-react' из библиотеки @ckeditor
     * Примечание: для использования встроенного отображения 'HtmlField', данный компонент должен быть передан
     * @example CKEditor
     */
    htmlComponent?: any,

    /**
     * Конструктор редактора 'ckeditor5-react' из библиотеки @steroidsjs/ckeditor5/packages/ckeditor5-build-classic
     * Примечание: для использования встроенного отображения 'HtmlField', данный компонент должен быть передан
     * @example ClassicEditor
     */
    editorConstructor?: any,

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
        htmlComponent: props.htmlComponent,
        editorConstructor: props.editorConstructor,
        disabled: props.disabled,
        input: props.input,
    }), [editorProps, onBlur, onChange, onFocus, props.disabled, props.editorConstructor, props.htmlComponent, props.input]);

    return components.ui.renderView(props.view || 'form.HtmlFieldView', viewProps);
}

HtmlField.defaultProps = {
    disabled: false,
    className: '',
};

export default fieldWrapper<IHtmlFieldProps>('HtmlField', HtmlField);
