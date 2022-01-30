/**
 * FormJS instance – every form = an instance.
 */
declare class Instance {
    ref: string;
    el: undefined | string;
    form: string | object;
    onsubmit: object;
    created: undefined | Function;
    beforeMount: undefined | Function;
    mounted: undefined | Function;
    getAllElements: () => Array<Element>;
    unmount: () => void;
    /**
     * Constructor
     * @param {string} ref - form instance reference.
     * @param {undefined|string} el - element to attach the form to.
     * @param {string|object} form - form object containing what the form needs to look like.
     * @param {object} onsubmit - onsubmit object containing what needs to happen when the form is submitted.
     */
    constructor(ref: string, el: undefined | string, form: string | object, onsubmit: object, created: undefined | Function, beforeMount: undefined | Function, mounted: undefined | Function);
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
    /**
     * Method to get a value of a chosen input by ID.
     * @param {string} elementId - element id.
     * @return {string}
     */
    getInputValue(elementId: string): string;
}

/**
 * FormJS library entry point.
 */
declare class FormJS {
    options: object;
    instances: Array<Instance>;
    validate: object;
    version: () => string;
    getInstances: () => Array<Instance>;
    error: (error: string) => void;
    /**
     * Constructor to initialise the form instance.
     * @param {object} options - FormJS options.
     * @return {Instance}
     */
    create: (options: object) => Instance | Error;
}

export { FormJS };