import * as React from 'react';
// import {CKEditor} from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@steroidsjs/ckeditor5/packages/ckeditor5-build-classic';

import {IBemHocOutput} from '../../../../src/hoc/bem';
import {IHtmlFieldViewProps} from '../../../../src/ui/form/HtmlField/HtmlField';
import {useBem} from '../../../../src/hooks';

export default function HtmlFieldView(props: IHtmlFieldViewProps & IBemHocOutput) {
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
