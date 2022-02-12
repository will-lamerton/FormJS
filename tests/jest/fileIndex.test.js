const FormJS = require('../../dist/formJS.js').FormJS;
const formjs = new FormJS;

test('You can create a new instance of FormJS', () => {
    expect(typeof formjs).toBe('object');

    // Methods that should exist on the class...
    expect(formjs.create).toBeDefined();
    expect(typeof formjs.create).toBe('function');

    expect(formjs.validate).toBeDefined();
    expect(typeof formjs.validate).toBe('function');

    expect(formjs.version).toBeDefined();
    expect(typeof formjs.version).toBe('function');

    expect(formjs.getInstances).toBeDefined();
    expect(typeof formjs.getInstances).toBe('function');

    expect(formjs.error).toBeDefined();
    expect(typeof formjs.error).toBe('function');
});

test('You can run an ad-hoc validation using the `validate` method', async () => {
    // Setup DOM
    document.body.innerHTML = "<input id='test'></input>";

    // Run validation that will fail:
    formjs.validate('test', 'isEmail').catch((result) => {
        resultToTest = result;
    });

    await new Promise(process.nextTick);

    expect(typeof resultToTest).toBe('object');
    expect(resultToTest).toMatchObject({
        passed: false,
        failed: 'Input must be a valid email!'
    });

    // Run validation that will pass:
    document.getElementById('test').value = 'test@test.com';

    formjs.validate('test', 'isEmail').then((result) => {
        resultToTest = result;
    }).catch((result) => {
        console.log(result)
    });

    await new Promise(process.nextTick);

    expect(typeof resultToTest).toBe('object');
    expect(resultToTest).toMatchObject({
        passed: true,
        failed: ''
    });

});

test('You can get the package version using the `version` method', () => {
    expect(formjs.version()).toBe(require('../../package.json').version);
});

test('You can get instances via the `getInstances` method', () => {
    // This should return an empty array as no forms have been made.
    expect(formjs.getInstances()).toEqual(
        expect.arrayContaining([])
    );

    expect(formjs.getInstances().length).toBe(0);

    // Let's make a quick form...
    document.body.innerHTML = '<form id="form"></form>';

    formjs.create({
        ref: 'form',
        form: 'form',
        onsubmit: {
            method: '',
            url: '',
        }
    });

    expect(formjs.getInstances()).toEqual(
        expect.arrayContaining([])
    );

    expect(formjs.getInstances().length).toBe(1);
});

test('FormJS can run the `error` method', () => {
    // Create spy.
    const errorSpy = jest.spyOn(formjs, 'error');

    // Run `create` setup to error.
    formjs.create({});

    // Error method should have been called.
    expect(errorSpy).toHaveBeenCalled();
});

test('FormJS can run the `warn` method', async () => {
    // Reset FormJS
    const formjs = new FormJS;

    // Create spy.
    const warnSpy = jest.spyOn(formjs, 'warn');

    // Set up our document body
    document.body.innerHTML = '<form id="form"></form>';

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

    // Wait for all async code to have finished executing.
    await new Promise(process.nextTick);

    // Call `unmount`.
    form.unmount();

    // Warn method should have been called.
    expect(warnSpy).toHaveBeenCalled();
});
