/**
 * FormJS instance – every form = an instance.
 */
declare class Instance {
    ref: string;
    el: undefined | string;
    form: string | FormObject;
    onsubmit: OnsubmitObject;
    created: undefined | Function;
    beforeMount: undefined | Function;
    mounted: undefined | Function;
    getAllElements: () => Array<Element>;
    getInputValue: (elementId: string) => string;
    unmount: () => void;
    /**
     * Constructor
     * @param {string} ref - form instance reference.
     * @param {undefined|string} el - element to attach the form to.
     * @param {string|Form} form - form object containing what the form needs to look like.
     * @param {OnsubmitObject} onsubmit - onsubmit object containing what needs to happen when the form is submitted.
     */
    constructor(ref: string, el: undefined | string, form: string | FormObject, onsubmit: OnsubmitObject, created: undefined | Function, beforeMount: undefined | Function, mounted: undefined | Function);
    /**
     * Method to mount the form instance.
     * @return {void}
     */
    mount(): void;
    /**
     * Method to destroy the instance.
     * @return {void}
     */
    destroy(): void;
}

/**
 * FormJS library entry point.
 */
declare class FormJS {
    options: FormJSOptions;
    instances: Array<Instance>;
    validate: object;
    version: () => string;
    getInstances: () => Array<Instance>;
    error: (error: string) => void;
    warn: (warning: string) => void;
    /**
     * Constructor
     */
    constructor();
    /**
     * Constructor to initialise the form instance.
     * @param {Options} options - FormJS options.
     * @return {Instance}
     */
    create: (options: FormJSOptions) => Instance | MakeInstanceFailed;
}

export { FormJS };
