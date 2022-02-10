const FormJS = require('../../dist/formJS.js').FormJS;
const formjs = new FormJS;

const consoleSpy = jest.spyOn(console, 'error');

test('You cannot pass the wrong `el` option type when creating a form', () => {
    // `el` expects string so we'll pass a number.
    formjs.create({
        ref: 'form',
        el: 1,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `el` in context `{"ref":"form","el":1}` requires type(s) `string`. Type `number` received.'),
    );
});

test('`el` cannot be a duplicate of an already existing `form` instance', () => {
    // Setup body.
    document.body.innerHTML = '<div id="form"></div>';

    // First, we'll create one instance.
    const form = formjs.create({
        ref: 'form1',
        el: 'form',
        form: {
            id: 'test',
            elements: [],
        },
        onsubmit: {
            method: '',
            url: '',
        }
    });

    // Then a second...
    const form2 = formjs.create({
        ref: 'form2',
        el: 'form', // <- Duplicate.
        form: {
            id: 'test',
            elements: [],
        },
        onsubmit: {
            method: '',
            url: '',
        }
    });

    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] FormJS instance with `el`, `form` is already in use.'),
    );
});
