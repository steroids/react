import '@testing-library/jest-dom';
import {JSXWrapper, render} from '../../../helpers';
import MaskField from '../../../../src/ui/form/MaskField/MaskField';
import {MASK_PRESETS} from '../../../../src/ui/form/InputField/InputField';

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
