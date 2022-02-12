const FormJS = require('../../dist/formJS.js').FormJS;
const formjs = new FormJS;

// Setup Jest to spy on the console.
const consoleErrorSpy = jest.spyOn(console, 'error');
const consoleLogSpy = jest.spyOn(console, 'log');

test('You can create a new form instance using the `create` method', () => {
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

test('You can mount a new form instance using the `mount` method', async () => {
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

test('You can get all elements in a form using the `getAllElements` method', async () => {
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
        }
    });

    // Mount form.
    form.mount();

    // Wait for all async code to execute...
    await new Promise(process.nextTick);

    // Call method and assign to a variable.
    const elements = form.getAllElements();

    expect(typeof elements).toBe('object');
    expect(elements.length).toBe(2);

    for (let i=0; i<elements.length; i++) {
        expect(typeof elements[i]).toBe('object');
    }
});

test('You can unmount a form via the `unmount` method', async () => {
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
        }
    });

    // Mount form.
    form.mount();

    // Wait for all async code to execute...
    await new Promise(process.nextTick);

    // The DOM should have a form in it that looks like below.
    expect(document.body.innerHTML).toBe('<div id="wrapper"><form id="form"><input type="email" name="email" id="input-email" required="true"><button type="submit" id="input-submit">submit</button></form></div>');

    // And the FormJS instance should have one instance on it.
    expect(formjs.getInstances().length).toBe(1);

    // Now, we'll call `unmount`.
    form.unmount();

    // The DOM should now not have the form in it.
    expect(document.body.innerHTML).toBe('<div id="wrapper"></div>');

    // But, the instance should remain registered with the framework.
    expect(formjs.getInstances().length).toBe(1);
});

test('You cannot unmount a form that was passed as an ID', async () => {
    // Set up our document body
    document.body.innerHTML = '<form id="form"></form>';

    // Reset FormJS
    const formjs = new FormJS;

    // Create a form.
    const form = formjs.create({
        ref: 'form',
        el: 'wrapper',
        form: 'form',
        onsubmit: {
            method: 'POST',
            url: '/test'
        }
    });

    // Setup mocks.
    const warnSpy = jest.spyOn(console, 'warn');

    // Mount form.
    form.mount();

    // Wait for all async code to execute...
    await new Promise(process.nextTick);

    // The DOM should not have changed.
    expect(document.body.innerHTML).toBe('<form id="form"></form>');

    // Next, we'll unmount the form.
    form.unmount();

    // The DOM should not have changed.
    expect(document.body.innerHTML).toBe('<form id="form"></form>');

    // And a warning should have shown too.
    expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FORM JS WARNING] This form wasn\'t created by FormJS but instead passed as an ID to the instance. Therefore, FormJS cannot remove it from the DOM. To have the ability to mount/unmount a form, create a new one by defining it on the `form` object. If you called this method via `destroy` the instance has however, been removed from the framework\'s record of instances.'),
    );
});

test('You can destroy a form instance via the `destroy` method', async () => {
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
        }
    });

    // Mount form.
    form.mount();

    // Wait for all async code to execute...
    await new Promise(process.nextTick);

    // The DOM should have a form in it that looks like below.
    expect(document.body.innerHTML).toBe('<div id="wrapper"><form id="form"><input type="email" name="email" id="input-email" required="true"><button type="submit" id="input-submit">submit</button></form></div>');

    // And the FormJS instance should have one instance on it.
    expect(formjs.getInstances().length).toBe(1);

    // Now, we'll call `destroy`.
    form.destroy();

    // The DOM should now not have the form in it.
    expect(document.body.innerHTML).toBe('<div id="wrapper"></div>');

    // And this time, the instance should no longer be stored by the framework.
    expect(formjs.getInstances().length).toBe(0);
});

test('You can get the value of an input via the `getInputValue` method', async () => {
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
                        value: 'test value' // <- we'll add this.
                    }
                },
            ]
        },

        onsubmit: {
            method: 'POST',
            url: '/test'
        }
    });

    // Mount form.
    form.mount();

    // Wait for all async code to execute...
    await new Promise(process.nextTick);

    // We'll now get the value of our only input and store it in a variable.
    const inputValue = form.getInputValue('input-email');

    expect(typeof inputValue).toBe('string');
    expect(inputValue).toBe('test value');
});
