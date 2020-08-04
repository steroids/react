import * as React from 'react';
import {EditorState, Modifier} from 'draft-js';
import HtmlField from '../HtmlField';

export default () => (
    <>
        <HtmlField
            label='Article content'
            uploadUrl={'/api/v1/file-test'}
            uploadImagesProcessor={'original'}
            customButtons={[<CustomButton/>]}
        />
    </>
);

interface ICustomButton {
    editorState?: any,
    onChange?: Function,
}

class CustomButton extends React.PureComponent<ICustomButton> {

    addText = () => {
        const customOption = "Custom text";
        const {editorState, onChange} = this.props;
        const contentState = Modifier.replaceText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            //There insert custom text
            customOption,
            editorState.getCurrentInlineStyle(),
        );
        onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    };

    render() {
        return (
            <div onClick={this.addText}>CUSTOM option</div>
        );
    }
}