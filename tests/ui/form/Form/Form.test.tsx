/* eslint-disable max-classes-per-file */
import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent, waitFor} from '@testing-library/react';
import Form from '../../../../src/ui/form/Form/Form';
import FormMockView from './FormMockView';
import InputField from '../../../../src/ui/form/InputField/InputField';
import {getElementByClassName, getElementByTag, render} from '../../../helpers';

jest.mock('../../../../src/actions/form', () => {
    const actual = jest.requireActual('../../../../src/actions/form');
    return {
        ...actual,
        formDestroy: jest.fn((formId) => ({type: actual.FORM_DESTROY,
            formId})),
    };
});

jest.mock('../../../../src/hooks/useAddressBar', () => ({
    __esModule: true,
    default: jest.fn(() => ({initialQuery: null,
        updateQuery: jest.fn()})),
}));

jest.mock('../../../../src/components/HttpComponent', () => ({
    __esModule: true,
    default: class MockHttp {
        send: any;

        constructor(components: any, config: any) {
            this.send = config?.send
                || (global as any).__FORM_HTTP_SEND__
                || jest.fn().mockResolvedValue({data: {}});
        }
    },
}));

jest.mock('../../../../src/components/ClientStorageComponent', () => ({
    __esModule: true,
    default: class MockClientStorageComponent {
        get: any;

        set: any;

        remove: any;

        constructor(components: any, config: any) {
            this.get = config?.get ?? jest.fn().mockReturnValue('');
            this.set = config?.set ?? (global as any).__FORM_CLIENT_STORAGE_SET__ ?? jest.fn();
            this.remove = config?.remove ?? jest.fn();
        }
    },
}));

describe('Form tests', () => {
    const defaultProps = {
        formId: 'TestForm',
        view: FormMockView,
        className: 'form-class-test',
        style: {width: '100%'},
        submitLabel: 'Отправить',
        fields: [
            {
                attribute: 'email',
                component: InputField,
                label: 'Email',
            },
            {
                attribute: 'name',
                component: InputField,
                label: 'Name',
            },
        ],
    };

    const expectedFormClass = 'FormView';

    it('should render form in the document', () => {
        const {container} = render(<Form {...defaultProps} />);
        const form = getElementByClassName(container, expectedFormClass);
        expect(form).toBeInTheDocument();
    });

    it('should have correct className', () => {
        const {container} = render(<Form {...defaultProps} />);
        const form = getElementByClassName(container, expectedFormClass);
        expect(form).toHaveClass(defaultProps.className);
    });

    it('should have correct style', () => {
        const {container} = render(<Form {...defaultProps} />);
        const form = getElementByClassName(container, expectedFormClass);
        expect(form).toHaveStyle(defaultProps.style);
    });

    it('should render submit button with correct label', () => {
        const {getByText} = render(<Form {...defaultProps} />);
        expect(getByText(defaultProps.submitLabel)).toBeInTheDocument();
    });

    it('should render fields from props', () => {
        const {container} = render(<Form {...defaultProps} />);
        const form = getElementByClassName(container, expectedFormClass);
        expect(form).toBeInTheDocument();
        const inputs = container.querySelectorAll('input:not([type=hidden])');
        expect(inputs.length).toBeGreaterThanOrEqual(defaultProps.fields!.length);
    });

    it('should render children', () => {
        const childrenContent = 'Custom form content';
        const {container} = render(
            <Form
                {...defaultProps}
                fields={[]}
            >
                <div data-testid="form-children">{childrenContent}</div>
            </Form>,
        );
        const children = container.querySelector('[data-testid="form-children"]');
        expect(children).toBeInTheDocument();
        expect(children).toHaveTextContent(childrenContent);
    });

    it('should call onSubmit when form is submitted', () => {
        const onSubmit = jest.fn();
        const {container} = render(
            <Form
                {...defaultProps}
                onSubmit={onSubmit}
            />,
        );
        const form = getElementByTag(container, 'form');
        fireEvent.submit(form);
        expect(onSubmit).toHaveBeenCalled();
    });

    it('should not render submit button when submitLabel is not passed', () => {
        const {container} = render(
            <Form
                formId="TestFormNoSubmit"
                view={FormMockView}
                fields={[]}
            />,
        );
        const form = getElementByClassName(container, expectedFormClass);
        expect(form).toBeInTheDocument();
        const button = container.querySelector('button[type="submit"]');
        expect(button).not.toBeInTheDocument();
    });

    it('should render with empty fields when fields prop is empty', () => {
        const {container, getByText} = render(
            <Form
                formId="TestFormEmpty"
                view={FormMockView}
                fields={[]}
                submitLabel="Save"
            />,
        );
        const form = getElementByClassName(container, expectedFormClass);
        expect(form).toBeInTheDocument();
        expect(getByText('Save')).toBeInTheDocument();
    });

    it('should render only children when view is false', () => {
        const childContent = 'Only child content';
        const {container} = render(
            <Form
                formId="TestFormNoView"
                view={false}
            >
                <div data-testid="form-child">{childContent}</div>
            </Form>,
        );
        expect(container.querySelector('form')).not.toBeInTheDocument();
        const child = container.querySelector('[data-testid="form-child"]');
        expect(child).toBeInTheDocument();
        expect(child).toHaveTextContent(childContent);
    });

    it('should not call onSubmit when onBeforeSubmit returns false', async () => {
        const onSubmit = jest.fn();
        const onBeforeSubmit = jest.fn().mockReturnValue(false);
        const {container} = render(
            <Form
                {...defaultProps}
                onSubmit={onSubmit}
                onBeforeSubmit={onBeforeSubmit}
            />,
        );
        const form = getElementByTag(container, 'form');
        fireEvent.submit(form);
        await waitFor(() => {
            expect(onBeforeSubmit).toHaveBeenCalled();
        });
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should not call onSubmit when validator returns false', async () => {
        const onSubmit = jest.fn();
        const validator = jest.fn().mockReturnValue(false);
        const {container} = render(
            <Form
                {...defaultProps}
                onSubmit={onSubmit}
                validator={validator}
            />,
        );
        const form = getElementByTag(container, 'form');
        fireEvent.submit(form);
        await waitFor(() => {
            expect(validator).toHaveBeenCalled();
        });
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should call onSubmit with cleaned form values', async () => {
        const onSubmit = jest.fn();
        const {container} = render(
            <Form
                {...defaultProps}
                onSubmit={onSubmit}
            />,
        );
        const emailInput = container.querySelector('input');
        expect(emailInput).toBeInTheDocument();
        fireEvent.input(emailInput!, {target: {value: 'test@example.com'}});
        const form = getElementByTag(container, 'form');
        fireEvent.submit(form);
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
        });
        const submittedValues = onSubmit.mock.calls[0][0];
        expect(submittedValues).not.toBeNull();
        expect(submittedValues).toEqual(expect.any(Object));
        expect(submittedValues).toHaveProperty('email', 'test@example.com');
    });

    it('should apply initialValues to form fields', () => {
        const initialValues = {
            email: 'initial@test.com',
            name: 'Initial Name',
        };
        const {getByDisplayValue} = render(
            <Form
                {...defaultProps}
                initialValues={initialValues}
            />,
        );
        expect(getByDisplayValue(initialValues.email)).toBeInTheDocument();
        expect(getByDisplayValue(initialValues.name)).toBeInTheDocument();
    });

    it('should call onChange when form values change', async () => {
        const onChange = jest.fn();
        const {container} = render(
            <Form
                {...defaultProps}
                onChange={onChange}
            />,
        );
        const emailInput = container.querySelector('input');
        expect(emailInput).toBeInTheDocument();
        fireEvent.input(emailInput!, {target: {value: 'new@mail.com'}});
        await waitFor(() => {
            expect(onChange).toHaveBeenCalled();
        });
        const lastCallValues = onChange.mock.calls[onChange.mock.calls.length - 1][0];
        expect(lastCallValues).toHaveProperty('email', 'new@mail.com');
    });

    it('should call preventDefault on submit event', () => {
        const onSubmit = jest.fn();
        const {container} = render(
            <Form
                {...defaultProps}
                onSubmit={onSubmit}
            />,
        );
        const form = getElementByTag(container, 'form');
        const event = new Event('submit', {bubbles: true,
            cancelable: true});
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
        fireEvent(form, event);
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should call onBeforeSubmit with values before onSubmit', async () => {
        const onSubmit = jest.fn();
        const onBeforeSubmit = jest.fn().mockReturnValue(true);
        const {container} = render(
            <Form
                {...defaultProps}
                onSubmit={onSubmit}
                onBeforeSubmit={onBeforeSubmit}
            />,
        );
        fireEvent.submit(getElementByTag(container, 'form'));
        await waitFor(() => {
            expect(onBeforeSubmit).toHaveBeenCalled();
            expect(onSubmit).toHaveBeenCalled();
        });
        expect(onBeforeSubmit).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should render additional buttons from buttons prop', () => {
        const extraButtonLabel = 'Доп. кнопка';
        const {getByText} = render(
            <Form
                {...defaultProps}
                buttons={<button type="button">{extraButtonLabel}</button>}
            />,
        );
        expect(getByText(extraButtonLabel)).toBeInTheDocument();
        expect(getByText(defaultProps.submitLabel!)).toBeInTheDocument();
    });
});

describe('Form tests with HTTP mock', () => {
    beforeEach(() => {
        delete (window as any).SteroidsComponents;
    });

    it('should call onAfterSubmit and onComplete on successful http submit', async () => {
        const responseData = {id: 1,
            success: true};
        const mockSend = jest.fn().mockResolvedValue({data: responseData});
        (global as any).__FORM_HTTP_SEND__ = mockSend;
        const onAfterSubmit = jest.fn();
        const onComplete = jest.fn();
        const {container} = render(
            <Form
                formId="FormHttpSuccess"
                view={FormMockView}
                action="/api/submit"
                fields={[]}
                onAfterSubmit={onAfterSubmit}
                onComplete={onComplete}
            />,
        );
        fireEvent.submit(getElementByTag(container, 'form'));
        await waitFor(() => {
            expect(mockSend).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(onAfterSubmit).toHaveBeenCalledWith(
                expect.any(Object),
                responseData,
                expect.objectContaining({data: responseData}),
            );
            expect(onComplete).toHaveBeenCalledWith(
                expect.any(Object),
                responseData,
                expect.objectContaining({data: responseData}),
            );
        });
        delete (global as any).__FORM_HTTP_SEND__;
    });

    it('should call onError when http request fails', async () => {
        const requestError = new Error('Network error');
        const mockSend = jest.fn().mockRejectedValue(requestError);
        (global as any).__FORM_HTTP_SEND__ = mockSend;
        const onError = jest.fn();
        const {container} = render(
            <Form
                formId="FormHttpError"
                view={FormMockView}
                action="/api/submit"
                fields={[]}
                onError={onError}
            />,
        );
        fireEvent.submit(getElementByTag(container, 'form'));
        await waitFor(() => {
            expect(mockSend).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(requestError);
        });
        delete (global as any).__FORM_HTTP_SEND__;
    });
});

describe('Form autoDestroy', () => {
    const formId = 'FormAutoDestroy';
    const {formDestroy} = require('../../../../src/actions/form');

    it('should dispatch formDestroy on unmount when autoDestroy is true', () => {
        formDestroy.mockClear();
        const {unmount} = render(
            <Form
                formId={formId}
                view={FormMockView}
                fields={[]}
                autoDestroy
            />,
        );
        unmount();
        expect(formDestroy).toHaveBeenCalledWith(formId);
    });
});

describe('Form addressBar', () => {
    it('should merge initialQuery from addressBar into initial values', () => {
        const initialQuery = {email: 'from-url@test.com'};
        const useAddressBarMock = require('../../../../src/hooks/useAddressBar').default;
        useAddressBarMock.mockReturnValueOnce({
            initialQuery,
            updateQuery: jest.fn(),
        });
        const {getByDisplayValue} = render(
            <Form
                formId="FormAddressBar"
                view={FormMockView}
                fields={[{attribute: 'email',
                    component: InputField,
                    label: 'Email'}]}
                addressBar
            />,
        );
        expect(getByDisplayValue(initialQuery.email)).toBeInTheDocument();
    });
});

describe('Form autoSave', () => {
    beforeEach(() => {
        delete (window as any).SteroidsComponents;
    });

    it('should save form values to clientStorage when autoSave is true', async () => {
        const mockSet = jest.fn();
        (global as any).__FORM_CLIENT_STORAGE_SET__ = mockSet;
        const {container} = render(
            <Form
                formId="FormAutoSave"
                view={FormMockView}
                fields={[{attribute: 'email',
                    component: InputField,
                    label: 'Email'}]}
                autoSave
            />,
        );
        const input = container.querySelector('input');
        fireEvent.input(input!, {target: {value: 'saved@test.com'}});
        await waitFor(() => {
            expect(mockSet).toHaveBeenCalled();
        });
        expect(mockSet).toHaveBeenCalledWith(
            'Form_FormAutoSave',
            expect.stringContaining('saved@test.com'),
        );
        delete (global as any).__FORM_CLIENT_STORAGE_SET__;
    });
});
