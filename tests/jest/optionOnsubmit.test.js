const FormJS = require('../../dist/formJS.js').FormJS;
const formjs = new FormJS;

const consoleSpy = jest.spyOn(console, 'error');

test('You have to pass an `onsubmit` option when creating a form', () => {
    // Create form minus `onsubmit`.
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `onsubmit` in context `{"ref":"form","el":"new-form","form":"form"}` required to create new FormJS instance.'),
    );
});

test('You cannot pass the wrong `onsubmit` type when creating a form', () => {
    // Create form minus `onsubmit`.
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',

        onsubmit: 1,
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `onsubmit` in context `{"ref":"form","el":"new-form","form":"form","onsubmit":1}` requires type(s) `object,Function`. Type `number` received.'),
    );
});

test('You have to pass a `method` option in `onsubmit` when creating a form', () => {
    // Create form minus with `onsubmit` but leave out `method`.
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',

        onsubmit: {}
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `method` in context `{}` required to create new FormJS instance.'),
    );
});

test('You cannot pass the wrong `method` type to `onsubmit` when creating a form', () => {
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',

        // Pass `method` as the wrong type.
        onsubmit: {
            method: 1
        },
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `method` in context `{"method":1}` requires type(s) `string`. Type `number` received.'),
    );
});

test('You have to pass a `url` option in `onsubmit` when creating a form', () => {
    // Create form minus with `onsubmit` but leave out `method`.
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',

        onsubmit: {
            method: 'POST',
        }
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `url` in context `{"method":"POST"}` required to create new FormJS instance.'),
    );
});

test('You cannot pass the wrong `url` type to `onsubmit` when creating a form', () => {
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',

        // Pass `url` as a number, it should be `string`.
        onsubmit: {
            method: 'POST',
            url: 1
        },
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `url` in context `{"method":"POST","url":1}` requires type(s) `string`. Type `number` received.'),
    );
});

test('You cannot pass the wrong `includeFormData` type to `onsubmit` when creating a form', () => {
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',

        // Pass `includeFormData` as a string, it should be `undefined|boolean`.
        onsubmit: {
            method: 'POST',
            url: '/test',

            includeFormData: 'wrongType'
        },
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `includeFormData` in context `{"method":"POST","url":"/test","includeFormData":"wrongType"}` requires type(s) `boolean`. Type `string` received.'),
    );
});

test('You cannot pass the wrong `before` type to `onsubmit` when creating a form', () => {
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',

        // Pass `before` as a number, it should be `undefined|Function`.
        onsubmit: {
            method: 'POST',
            url: '/test',

            before: 1
        },
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `before` in context `{"method":"POST","url":"/test","before":1}` requires type(s) `function,Function`. Type `number` received.'),
    );
});

test('You cannot pass the wrong `success` type to `onsubmit` when creating a form', () => {
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',

        // Pass `success` as a number, it should be `undefined|Function`.
        onsubmit: {
            method: 'POST',
            url: '/test',

            success: 1
        },
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `success` in context `{"method":"POST","url":"/test","success":1}` requires type(s) `function,Function`. Type `number` received.'),
    );
});

test('You cannot pass the wrong `error` type to `onsubmit` when creating a form', () => {
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',

        // Pass `error` as a number, it should be `undefined|Function`.
        onsubmit: {
            method: 'POST',
            url: '/test',

            error: 1
        },
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `error` in context `{"method":"POST","url":"/test","error":1}` requires type(s) `function,Function`. Type `number` received.'),
    );
});
