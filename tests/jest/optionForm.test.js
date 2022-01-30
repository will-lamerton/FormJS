const FormJS = require('../../dist/formJS.js').FormJS;
const formjs = new FormJS;

// Setup Jest to spy on the console.
test('You have to pass a `form` option when creating a form', () => {
    const consoleSpy = jest.spyOn(console, 'error');

    formjs.create({
        ref: 'form',
        el: 'new-form',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `form` in context `{\"ref\":\"form\",\"el\":\"new-form\"}` required to create new FormJS instance.'),
    );
});

test('You cannot pass the wrong `form` option type when creating a form', () => {
    const consoleSpy = jest.spyOn(console, 'error');

    // `form` expects either a string OR object so we'll pass a number.
    formjs.create({
        ref: 'form',
        el: 'new-form',

        form: 1,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `form` in context `{"ref":"form","el":"new-form","form":1}` requires type(s) `object,string`. Type `number` received.'),
    );
});

test('You have to pass an `id` in the `form` option if passed as an object when creating a form', () => {
    const consoleSpy = jest.spyOn(console, 'error');

    formjs.create({
        ref: 'form',
        el: 'new-form',

        // Form object with missing `id`.
        form: {
            noId: 'oops'
        }
    });

    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `id` in context `{"noId":"oops"}` required to create new FormJS instance.'),
    );
});

test('You cannot pass the wrong `id` type to `form` option when creating a form', () => {
    const consoleSpy = jest.spyOn(console, 'error');

    formjs.create({
        ref: 'form',
        el: 'new-form',

        form: {
            // ID expects a string so we'll pass a number
            id: 1,
        },
    });

    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `id` in context `{"id":1}` requires type(s) `string`. Type `number` received.'),
    );
});

test('You have to pass `elements` in the `form` option if passed as an object when creating a form', () => {
    const consoleSpy = jest.spyOn(console, 'error');

    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: {
            id: 'form',
        }
    });

    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `elements` in context `{"id":"form"}` required to create new FormJS instance.'),
    );
});

test('You cannot pass the wrong `elements` type to `form` option when creating a form', () => {
    const consoleSpy = jest.spyOn(console, 'error');

    formjs.create({
        ref: 'form',
        el: 'new-form',

        form: {
            id: 'form',
            // Elements expects object, passing number.
            elements: 1,
        },
    });

    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `elements` in context `{"id":"form","elements":1}` requires type(s) `object`. Type `number` received.'),
    );
});

test('If `form` passed as a string, it cannot be a duplicate of an already existing `form` instance', () => {
    const consoleSpy = jest.spyOn(console, 'error');

    // Set up our document body
    document.body.innerHTML = '<form id="form-one"></form>';

    // First, we'll create one instance and attach it to the above form.
    const form = formjs.create({
        ref: 'form1',
        form: 'form-one',
        onsubmit: {
            type: '',
            url: '',
        }
    });

    // Then a second...
    const form2 = formjs.create({
        ref: 'form2',
        form: 'form-one', // <- Duplicate.
        onsubmit: {
            type: '',
            url: '',
        }
    });

    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] FormJS instance with `form`, `form-one` is already in use.'),
    );
});
