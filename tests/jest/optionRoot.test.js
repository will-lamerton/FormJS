const FormJS = require('../../dist/formJS.js').FormJS;
const formjs = new FormJS;

test('You cannot pass the wrong `created` type when creating a form.', () => {
    // Setup Jest to spy on the console.
    const consoleSpy = jest.spyOn(console, 'error');

    // Create form minus `onsubmit`.
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',

        onsubmit: {
            method: '',
            url: '',
        },

        created: 1,
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `created` in context `{\"ref\":\"form\",\"el\":\"new-form\",\"form\":\"form\",\"onsubmit\":{\"method\":\"\",\"url\":\"\"},\"created\":1}` requires type(s) `function,Function`. Type `number` received.'),
    );
});

test('You cannot pass the wrong `beforeMount` type when creating a form.', () => {
    // Setup Jest to spy on the console.
    const consoleSpy = jest.spyOn(console, 'error');

    // Create form minus `onsubmit`.
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',

        onsubmit: {
            method: '',
            url: '',
        },

        beforeMount: 1,
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `beforeMount` in context `{\"ref\":\"form\",\"el\":\"new-form\",\"form\":\"form\",\"onsubmit\":{\"method\":\"\",\"url\":\"\"},\"beforeMount\":1}` requires type(s) `function,Function`. Type `number` received.'),
    );
});

test('You cannot pass the wrong `mounted` type when creating a form.', () => {
    // Setup Jest to spy on the console.
    const consoleSpy = jest.spyOn(console, 'error');

    // Create form minus `onsubmit`.
    formjs.create({
        ref: 'form',
        el: 'new-form',
        form: 'form',

        onsubmit: {
            method: '',
            url: '',
        },

        mounted: 1,
    });

    // Expect an error.
    expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] Option `mounted` in context `{\"ref\":\"form\",\"el\":\"new-form\",\"form\":\"form\",\"onsubmit\":{\"method\":\"\",\"url\":\"\"},\"mounted\":1}` requires type(s) `function,Function`. Type `number` received.'),
    );
});
