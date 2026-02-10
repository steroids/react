import '@testing-library/jest-dom';
import {MASK_PRESETS} from '../../../../src/ui/form/InputField/InputField';
import MaskField from '../../../../src/ui/form/MaskField/MaskField';
import {JSXWrapper, render} from '../../../helpers';

describe('MaskField tests', () => {
    const label = 'mask phone';

    const props = {
        label,
        maskOptions: MASK_PRESETS.phone,
        showClear: true,
    };

    it('should be in the document', () => {
        const {getByText} = render(JSXWrapper(MaskField, props));

        const maskField = getByText(label + ':');
        expect(maskField).toBeInTheDocument();
    });
});
