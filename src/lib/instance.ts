import { Form } from './form';

/**
 * FormJS instance – every form = an instance.
 */
export class Instance
{
    // Class variables.
    ref: string;
    el: undefined|string;
    form: string|FormObject;
    onsubmit: OnsubmitObject;

    // Lifecycle event hooks.
    created: undefined|Function;
    beforeMount: undefined|Function;
    mounted: undefined|Function;

    // One line methods...
    getAllElements = (): Array<Element> => (typeof this.form === 'object') ? [...document.getElementById(this.form.id).children] : [...document.getElementById(this.form).children];
    unmount = (): void => document.getElementById(this.form['id']).remove();

    /**
     * Constructor
     * @param {string} ref - form instance reference.
     * @param {undefined|string} el - element to attach the form to.
     * @param {string|Form} form - form object containing what the form needs to look like.
     * @param {OnsubmitObject} onsubmit - onsubmit object containing what needs to happen when the form is submitted.
     */
    constructor(
        ref: string,
        el: undefined|string,
        form: string|FormObject,
        onsubmit: OnsubmitObject,
        created: undefined|Function,
        beforeMount: undefined|Function,
        mounted: undefined|Function
    )
    {
        // Set instance variables.
        this.ref = ref;
        this.el = el;
        this.form = form;
        this.onsubmit = onsubmit;
        this.created = created;
        this.beforeMount = beforeMount;
        this.mounted = mounted;

        // Once the instance is created, run the created hook if it exists.
        if (this.created !== undefined) {
            this.created();
        }
    }

    /**
     * Method to mount the form instance.
     * @return {void}
     */
    mount(): void
    {
        // Create a new form instance.
        const form = new Form(this.form, this.onsubmit, this.el);

        // Run before mounted hook if it exists.
        if (this.beforeMount !== undefined) {
            this.beforeMount();
        }

        // If we have a form object then we will need to build the form.
        if (typeof this.form === 'object') {
            form.create().then(() => {
                // Once the form is made, we need to create the internal
                // elements...
                form.createInternalElements(this.form['id']).then(() => {
                    // Then we need to bind events to the form...
                    form.bind().then(() => {
                        // Run mounted hook if that exists.
                        if (this.mounted !== undefined) {
                            this.mounted();
                        }
                    })
                });
            });
        }
        // Else, if the form is already in the DOM, we just need to bind the
        // onsubmit event to it.
        else {
            // Then we need to bind events to the form...
            form.bind().then(() => {
                if (this.mounted !== undefined) {
                    this.mounted();
                }
            })
        }
    }

    /**
     * Method to destroy the instance.
     * @return {void}
     */
    destroy(): void
    {
        // Remove from DOM.
        this.unmount();
        // Remove instance reference.
        window.__FORMJS__.instances = window.__FORMJS__.instances.filter(current => current !== this);
    }

    /**
     * Method to get a value of a chosen input by ID.
     * @param {string} elementId - element id.
     * @return {string}
     */
    getInputValue(elementId: string): string {
        // If the element was already present in the DOM when we created the instance
        // then we won't have a record of it. Throw an error here.
        if (typeof this.form !== 'object') {
            throw window.__FORMJS__.error(`Trying to get input value of an element that doesn't exist on the instance \`${this.ref}\`.`)
        }

        // Else, filter elements to check that it exists. Then return.
        const elements = this.form.elements.filter((element: object) => element['attributes']['id'] === elementId);

        // If there is no element on the instance with that ID, throw an error.
        if (elements.length === 0) {
            throw window.__FORMJS__.error(`Trying to get input value of an element that doesn't exist on the instance \`${this.ref}\`.`)
        }

        return document.getElementById(elementId)['value'];
    }
}
