const FormJS = require('../../dist/formJS.js').FormJS;
const formjs = new FormJS;

// Setup Jest to spy on the console.
const consoleSpy = jest.spyOn(console, 'error');

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
