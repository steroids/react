import * as React from 'react';
import InputField from '../../InputField';
import Form from '../../Form';
import Button from '../../Button';
import ReCaptchaField from '../ReCaptchaField';

/**
 * Обычный пример использования ReCaptchaField в Form.
 * @order 1
 * @col 4
 */

export default () => (
    <>
        <Form
            formId='CaptchaForm'
            layout={false}
        >
            <InputField
                label='Label'
                attribute='text'
                required
            />
            <ReCaptchaField attribute='token' />
            <Button
                type='submit'
                label='Submit'
            />
        </Form>
    </>
);
