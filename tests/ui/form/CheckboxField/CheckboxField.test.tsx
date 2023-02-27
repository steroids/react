import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent, screen} from '@testing-library/dom';
import CheckboxField, {ICheckboxFieldViewProps} from '../../../../src/ui/form/CheckboxField/CheckboxField';
import CheckboxFieldMockView from './CheckboxFieldMockView';
import {IBemHocInput} from '../../../../src/hoc/bem';
import {render} from '../../../customRender';

type PropsType = ICheckboxFieldViewProps & IBemHocInput;

describe('CheckboxField tests', () => {
    const props: PropsType = {
        view: CheckboxFieldMockView,

        inputProps: {
            name: 'checkbox-test',
            type: 'checkbox',
            checked: false,
            onChange: () => { },
            disabled: false,
        },
    };

    function JSXWrapper(additionalProps: Omit<PropsType, 'inputProps'> | null = null) {
        return (
            <div>
                <CheckboxField
                    {...props}
                    {...additionalProps}
                />
            </div>
        );
    }

    const expectedCheckboxClass = 'CheckboxFieldView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper());
        const checkbox = container.getElementsByClassName(expectedCheckboxClass)[0];

        expect(checkbox).toBeInTheDocument();
    });

    it('should have external class name and style', () => {
        const externalClassName = 'external-class-test';
        const externalStyle = {
            width: '30px',
        };

        const {container} = render(JSXWrapper({
            className: externalClassName,
            style: externalStyle,
        }));

        const checkbox = container.getElementsByClassName(externalClassName)[0];

        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toHaveStyle(externalStyle);
    });

    it('should have label', () => {
        const label = 'label';

        const {getByText} = render(JSXWrapper({
            label,
        }));

        const checkbox = getByText(label);

        expect(checkbox).toBeInTheDocument();
    });

    it('should have name', () => {
        const {container} = render(JSXWrapper());
        const input = container.getElementsByClassName(`${expectedCheckboxClass}__input`)[0];

        expect(input).toHaveAttribute('name', 'checkbox-test');
    });
});
