import { IHtmlFieldViewProps } from '../../../../src/ui/form/HtmlField/HtmlField';
import {useBem} from '../../../../src/hooks';

export default function HtmlFieldView(props: IHtmlFieldViewProps) {
    const bem = useBem('HtmlFieldView');

    if (process.env.IS_SSR) {
        return null;
    }

    return (
        <div className={bem.block()}>
            {/* <CKEditor
                editor={ClassicEditor}
                disabled={props.disabled}
                config={props.editorProps}
                data={!props.input.value ? '' : props.input.value}
                onChange={props.onChange}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
            /> */}
        </div>
    );
}
