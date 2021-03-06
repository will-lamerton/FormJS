const FormJS = require('../../dist/formJS.js').FormJS;
const formjs = new FormJS;

const consoleSpy = jest.spyOn(console, 'error');

test('You have to pass a `ref` option when creating a form', () => {
    formjs.create({});

    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `ref` in context `{}` required to create new FormJS instance.'),
    );
});

test('You cannot pass the wrong `ref` option type when creating a form', () => {
    // `ref` expects string so we'll pass a number.
    formjs.create({
        ref: 1,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `ref` in context `{"ref":1}` requires type(s) `string`. Type `number` received.'),
    );
});

test('`ref` cannot be a duplicate of an already existing `form` instance', () => {
    // Set up our document body
    document.body.innerHTML = '<form id="form-one"></form><form id="form-two"></form>';

    // First, we'll create one instance.
    const form = formjs.create({
        ref: 'form',
        form: 'form-one',
        onsubmit: {
            method: '',
            url: '',
        }
    });

    // Then a second...
    const form2 = formjs.create({
        ref: 'form', // <- Duplicate.
        form: 'form-two',
        onsubmit: {
            method: '',
            url: '',
        }
    });

    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] FormJS instance with `ref`, `form` is already in use.'),
    );
});
