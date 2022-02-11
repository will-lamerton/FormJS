import { Validator } from './validator';

/**
 * A set of functions that help with form processing.
 */
export class Form
{
    fetchApiParams = {};
    form: string|FormObject;
    onsubmit: OnsubmitObject;
    wrappingEl: string;

    /**
     * Constructor
     * @param {string|FormObject} form - form definition.
     * @param {OnsubmitObject} onsubmit - onsubmit definition.
     * @param {string} wrappingEl - wrapping element for form.
     */
    constructor(form: string|FormObject, onsubmit: OnsubmitObject, wrappingEl: string)
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
        return new Promise((resolve: Function, reject: Function) => {
            // Reject if wrong type.
            if (typeof this.form === 'string') {
                return reject();
            }

            // Create a new form element and set the ID equal to the passed ID.
            const form = document.createElement('form');
            form.setAttribute('id', this.form.id);

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
        return new Promise((resolve: Function, reject: Function) => {
            // If wrong type, reject.
            if (typeof this.form === 'string') {
                return reject();
            }

            // We'll loop through the elements specified and create new elements
            // inside the form.
            this.form.elements.forEach((element: FormObjectElements) => {
                const elementName = element.el;
                const formElement = document.createElement(elementName);

                // If element has 'text' property, then we can set the innerHTML.
                if (element.hasOwnProperty('text')) {
                    formElement.innerHTML = element.text;
                }

                // We'll also loop through the attributes passed in each element and
                // mount those too if they're present.
                if (element.hasOwnProperty('attributes')) {
                    for (const [key, value] of Object.entries(element.attributes)) {
                        formElement.setAttribute(key, value);
                    }
                }

                // Once we're done, we'll append the new element to the form.
                document.getElementById(rootElement).appendChild(formElement);

                // Lastly, let's check if there are any rooted elements to mount too.
                // If there is, re-run this method.
                if (element.hasOwnProperty('elements')) {
                    this.createInternalElements(element.attributes.id);
                }
            });

            // All done, so resolve.
            return resolve();
        });
    }

    /**
     * Method to bind the form to onsubmit event.
     * @return {Promise<any>}
     */
    bind(): Promise<Function> {
        return new Promise((resolve: Function) => {
            // Bind form...
            document.getElementById((typeof this.form === 'string') ? this.form : this.form.id).addEventListener('submit', (e: any) => this.submit(e));

            // Set up non-dynamic Fetch API params for submission.

            // Here's a list of keys we *cannot* add to the params as they're
            // reserved for FormJS workings.
            const blacklistedKeys = ['method', 'url', 'body', 'before', 'success', 'error'];
            Object.entries(this.onsubmit).forEach(([key,value]) => {
                // Assume to begin with the key on loop is not blacklisted.
                let containsBlacklistedKey = false;

                // For every key on loop, loop through blakclisted keys and
                // look for a match
                blacklistedKeys.forEach(blacklistedKey => {
                    if (blacklistedKey == key) {
                        // Set `containsBlacklistedKey` equal to true and break
                        // this loop.
                        containsBlacklistedKey = true;
                        return;
                    }
                });

                // Check to see if the above loop found a match and if it didn't
                // add the key=>value to the list of params to be used during
                // submission.
                if (containsBlacklistedKey === false) {
                    this.fetchApiParams[key] = value;
                }
            });

            return resolve();
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
        if (this.onsubmit.before !== undefined) {
            this.onsubmit.before();
        }

        // The user can choose to submit the form with or without form data.
        //
        // Determine whether or not we need to with the below statement and either
        // set `formData` equal to the forms data *or* an empty object.
        const formData = (this.onsubmit.includeFormData === true || this.onsubmit.includeFormData === undefined) ?
            Object.fromEntries(new FormData(e.target).entries()) :
            {}
        ;

        // If form passed as type object, then we could need to run validations
        // too...
        this.validate(formData).then(() => {
            // Create a new Fetch API request with the URL & method from the onsubmit
            // object and the JSON data from the form.
            fetch(this.onsubmit.url, {
                method: this.onsubmit.method,
                body: JSON.stringify(formData),
                ...this.fetchApiParams

            }).then((response: any) => {
                // If the response was not `ok`, catch the error.
                if (response['ok'] === false) {
                    throw response;
                }

                // If a `success` method exists on the onsubmit object, run it
                // passing the response.
                if (this.onsubmit.success !== undefined) {
                    this.onsubmit.success(response);
                }
            }).catch((error: object) => {
                // If an `error` method exists on the onsubmit object, run it.
                if (this.onsubmit.error !== undefined) {
                    this.onsubmit.error({
                        error: error,
                        source: 'request/response'
                    });
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
                        if (this.onsubmit.error !== undefined) {
                            this.onsubmit.error({
                                error: test.failed,
                                source: 'validator'
                            });
                        }
                        return reject(test.failed);
                    })
                ;
            ;
        });
    }
};
