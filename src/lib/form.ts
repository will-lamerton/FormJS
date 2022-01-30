import { Validator } from './validator';

/**
 * A set of functions that help with form processing.
 */
export class Form
{
    form: object|string;
    onsubmit: object;
    wrappingEl: string;

    /**
     * Constructor
     * @param {object|string} form - form definition.
     * @param {object} onsubmit - onsubmit definition.
     * @param {string} wrappingEl - wrapping element for form.
     */
    constructor(form: object|string, onsubmit: object, wrappingEl: string)
    {
        this.form = form;
        this.onsubmit = onsubmit;
        this.wrappingEl = wrappingEl;
    }

    /**
     * Method to create a new form.
     * @return {Promise<Function>}
     */
    create(): Promise<Function>
    {
        // Create a new promise...
        return new Promise((resolve: Function) => {
            // Create a new form element and set the ID equal to the passed ID.
            const form = document.createElement('form');
            form.setAttribute('id', this.form['id']);

            // Append the form to the chosen `el` in the DOM structure.
            document.getElementById(this.wrappingEl).appendChild(form);

            // All created, so resolve.
            return resolve();
        });
    }

    /**
     * Method to create elements inside the newly created form!
     * @param {Array<object>} elementsList - list of elements to create.
     * @param {string} rootElement - element id to create new elements in.
     * @return {Promise<Function>}
     */
    createInternalElements(rootElement: string): Promise<Function>
    {
        return new Promise((resolve: Function) => {
            // We'll loop through the elements specified and create new elements
            // inside the form.
            this.form['elements'].forEach((element: object) => {
                const elementName = element['el'];
                const formElement = document.createElement(elementName);

                // If element has 'text' property, then we can set the innerHTML.
                if (element.hasOwnProperty('text')) {
                    formElement.innerHTML = element['text'];
                }

                // We'll also loop through the attributes passed in each element and
                // mount those too if they're present.
                if (element.hasOwnProperty('attributes')) {
                    for (const [key, value] of Object.entries(element['attributes'])) {
                        formElement.setAttribute(key, value);
                    }
                }

                // Once we're done, we'll append the new element to the form.
                document.getElementById(rootElement).appendChild(formElement);

                // Lastly, let's check if there are any rooted elements to mount too.
                // If there is, re-run this method.
                if (element.hasOwnProperty('elements')) {
                    this.createInternalElements(element['attributes']['id']);
                }
            });

            // All done, so resolve.
            return resolve();
        });
    }

    /**
     * Method to bind the form to onsubmit event.
     * @return {Promise<Function>}
     */
    bind(): Promise<Function> {
        return new Promise(() => {
             document.getElementById((typeof this.form === 'string') ? this.form : this.form['id']).addEventListener('submit', (e: any) => this.submit(e));
        });
    }

    /**
     * Method to handle form submissions.
     * @param {Event} e - event.
     * @return {void}
     * @throws {Error}
     */
    submit(e: any): void
    {
        // Prevent default.
        e.preventDefault();

        // Before we submit, if there's a a `before` method to run, run it.
        if (this.onsubmit['before'] !== undefined) {
            this.onsubmit['before']();
        }

        // Get form data to submit with it.
        const formData = Object.fromEntries(new FormData(e.target).entries());

        // If form passed as type object, then we could need to run validations
        // too...
        this.validate(formData).then(() => {
            // Create a new Fetch API request with the URL & method from the onsubmit
            // object and the JSON data from the form.
            fetch(this.onsubmit['url'], {
                method: this.onsubmit['type'],
                body: JSON.stringify(formData)
            }).then((response: any) => {
                // If the response was not `ok`, catch the error.
                if (response['ok'] === false) {
                    throw response;
                }

                // Parse the response body and if a `success` method exists on
                // the onsubmit object, run it.
                response.json().then((data: any) => (this.onsubmit['success'] !== undefined) ? this.onsubmit['success'](data) : false);
            }).catch((error: object) => {
                // If an `error` method exists on the onsubmit object, run it.
                if (this.onsubmit['error'] !== undefined) {
                    this.onsubmit['error'](error);
                }
            });
        });
    }

    /**
     * Method to validate form data against required validation.
     * @param {object} formData - formData object.
     * @return {Promise<Function>}
     */
    validate(formData: object): Promise<Function>
    {
        // Create a new promise to pass or fail validations...
        return new Promise(async (resolve: Function, reject: Function) => {
            // Check if our form was made by FormJS or by passing an ID.
            // This will determine whether we validate or not.
            //
            // If made by user and passed as an ID, there won't be any
            // validations to run at this time, so, resolve early.
            //
            // If there was an object, we'll create a new validator instance and
            // run our tests...
            return (typeof this.form === 'string') ?
                resolve() :
                await new Validator(this.form, formData).test()
                    // Passed.
                    .then(() => resolve())
                    // Failed.
                    .catch(test => {
                        if (this.onsubmit['error'] !== undefined) {
                            this.onsubmit['error'](test.failed, 'validator');
                        }
                        return reject(test.failed);
                    })
                ;
            ;
        });
    }
};
