const FormJS = require('../../dist/formJS.js').FormJS;
const formjs = new FormJS;

// Setup Jest to spy on the console.
const consoleErrorSpy = jest.spyOn(console, 'error');
const consoleLogSpy = jest.spyOn(console, 'log');

test('You can create a new form instance', () => {
    // Create a form.
    const form = formjs.create({
        ref: 'form',
        el: 'form-wrapper',
        form: 'form',

        onsubmit: {
            method: 'POST',
            url: '/test'
        },

        created() {
            console.log('created!');
        },
        beforeMount() {},
        mounted() {}
    });

    // Instance as a whole.
    expect(form).toBeDefined();
    expect(typeof form).toBe('object');

    // Passed options.
    expect(form.ref).toBeDefined();
    expect(typeof form.ref).toBe('string');
    expect(form.ref).toBe('form');

    expect(form.el).toBeDefined();
    expect(typeof form.el).toBe('string');
    expect(form.el).toBe('form-wrapper');

    expect(form.form).toBeDefined();
    expect(typeof form.form).toBe('string');
    expect(form.form).toBe('form');

    expect(form.onsubmit).toBeDefined();
    expect(typeof form.onsubmit).toBe('object');
    expect(form.created).toBeDefined();
    expect(typeof form.created).toBe('function');
    expect(form.beforeMount).toBeDefined();
    expect(typeof form.beforeMount).toBe('function');
    expect(form.mounted).toBeDefined();
    expect(typeof form.mounted).toBe('function');

    // Instance methods
    expect(form.getAllElements).toBeDefined();
    expect(typeof form.getAllElements).toBe('function');
    expect(form.unmount).toBeDefined();
    expect(typeof form.unmount).toBe('function');
    expect(form.destroy).toBeDefined();
    expect(typeof form.destroy).toBe('function');
    expect(form.getInputValue).toBeDefined();
    expect(typeof form.getInputValue).toBe('function');

    // FormJS instance changes
    expect(formjs.instances.length).toBe(1);

    // Check `created` callback is made.
    expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('created!'),
    );
});

test('You cannot create a new form instance if option validation failed', () => {
    const formjs = new FormJS;
    const form = formjs.create({});

    expect(form).toBeDefined();
    expect(typeof form).toBe('object');

    expect(form.mount).toBeDefined();
    expect(typeof form.mount).toBe('function');

    // If this fails, it means an Instance was returned.
    expect(form.ref).not.toBeDefined();

    // FormJS instance should have no changes.
    expect(formjs.instances.length).toBe(0);

    // We'll test it errors too just to be sure.
    form.mount();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORMJS ERROR] You can\'t mount an instance which failed to create.'),
    );
});

test('You can mount a new form instance', async () => {
    // Set up our document body
    document.body.innerHTML = '<div id="wrapper"></div>';

    // Reset FormJS
    const formjs = new FormJS;

    // Create a form.
    const form = formjs.create({
        ref: 'form',
        el: 'wrapper',
        form: {
            id: 'form',
            elements: [
                {
                    el: 'input',
                    validate: 'isEmail',

                    attributes: {
                        type: 'email',
                        name: 'email',
                        id: 'input-email',
                        required: true,
                    }
                },
                {
                    el: 'button',
                    text: 'submit',

                    attributes: {
                        type: 'submit',
                        id: 'input-submit',
                    }
                }
            ]
        },

        onsubmit: {
            method: 'POST',
            url: '/test'
        },

        created() {},

        beforeMount() {
            console.log('beforeMount!');
        },
        mounted() {
            console.log('mounted!');
        }
    });

    // Setup mocks.
    form.beforeMount = jest.spyOn(form, 'beforeMount');
    form.mounted = jest.spyOn(form, 'mounted');

    // Mount form.
    form.mount();

    // Wait for all async code to execute...
    await new Promise(process.nextTick);

    // Hooks should have been executed.
    expect(form.beforeMount).toHaveBeenCalled();
    expect(form.mounted).toHaveBeenCalled();

    // The DOM should have a form in it that looks like below.
    expect(document.body.innerHTML).toBe('<div id="wrapper"><form id="form"><input type="email" name="email" id="input-email" required="true"><button type="submit" id="input-submit">submit</button></form></div>');
});

// getAllElements test.
// unmount test.
// destroy test.
// getInputValue test.
