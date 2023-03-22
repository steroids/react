import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {render} from '../../../customRender';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import DropDownField, {IDropDownFieldViewProps} from '../../../../src/ui/form/DropDownField/DropDownField';
import DropDownFieldMockView from './DropDownFieldMockView';

describe('DropDownField tests', () => {
    const items = [
        {
            id: 1,
            label: 'First',
            type: 'icon',
            src: 'mockIcon',
        },
        {
            id: 2,
            label: 'Second',
        },
    ];

    const props = {
        color: 'primary',
        size: 'lg',
        placeholder: 'placeholder',
        view: DropDownFieldMockView,
    } as IDropDownFieldViewProps;

    const expectedDropDownFieldClassName = 'DropDownField';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(DropDownField, props));

        const component = getElementByClassName(container, expectedDropDownFieldClassName);

        expect(component).toBeInTheDocument();
    });
});
