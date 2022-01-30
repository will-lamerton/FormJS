/**
 * Class to validate form entries.
 */
export class Validator
{
    // Class variables.
    form: null|object|string;
    formData: null|object;
    validationsToMake: Array<object> = [];

    /**
     * Constructor
     * @param {object} form - form object.
     * @param {object} formData - form data object.
     */
    constructor(form: null|object|string = null, formData: null|object = null)
    {
        this.form = form;
        this.formData = formData;

        // If we have a form object, then we need to gather the form
        // validations required into an array to action.
        if (form !== null) {
            this.sortValidations(this.form);
        }
    }

    /**
     * Method to run validation tests.
     * @param {null|object} options - options { el: string, rules: string }
     * @return {object}
     */
    async test(options: null|object = null): Promise<any>
    {
        // Sometimes the validation class will be used for ad-hoc validations
        // by passing an object. If one isn't passed though, we'll assume we're
        // testing all validations across a whole form...
        if (options !== null) {
            this.validationsToMake.push({
                element: options['el'],
                criteria: options['rules'],
            });
        }

        // Setting result structure up.
        let result: any = { passed: true, failed: '' };

        // Create a new labelled `for` loop that then loops through every
        // validation to make.
        validationLayer: for (const validation of this.validationsToMake) {
            // Split validations down into an array of criteria.
            // Each criteria is seperated by `|`.
            const allCriteria = validation['criteria'].split('|');

            // Then, loop through each criteria and match it to a test.
            for (const criteria of allCriteria) {
                if (criteria.includes('minLength:')) {
                    result = this.testMinLength(validation['element'], criteria)
                }
                else if (criteria.includes('maxLength:')) {
                    result = this.testMaxLength(validation['element'], criteria);
                }
                else if (criteria.includes('isEmail')) {
                    result = this.testIsEmail(validation['element']);
                }
                else if (criteria.includes('isNotDisposableEmail')) {
                    await this.testIsDisposableEmail(validation['element']).then(response => result = response);
                }
                else if (criteria.includes('hasNumber')) {
                    result = this.testHasNumber(validation['element']);
                }
                else if (criteria.includes('hasSymbol')) {
                    result = this.testHasSymbol(validation['element']);
                }
                else if (criteria.includes('hasCapital')) {
                    result = this.testHasCapital(validation['element']);
                }
                else if (criteria.includes('required')) {
                    result = this.testRequired(validation['element']);
                }

                // If no matching type, set result to an issue.
                else {
                    result = {
                        passed: false,
                        failed: `Validation rule \`${criteria}\` not recognised`
                    };
                }

                // At the end of each loop, check to see if a test failed and if
                // it did, break to the outer layer...
                if (result['passed'] === false) {
                    break validationLayer;
                }
            }
        }

        // Return promise based on outcome.
        return (result.passed === true) ?
            Promise.resolve(result) :
            Promise.reject(result)
        ;
    }

    /**
     * Method to sort through the validations in the form object and create a
     * list of them to action.
     * @param {object|string} form - form object containing elements.
     * @return {void}
     */
    private sortValidations(form: object|string): void
    {
        // Loop through passed form object.
        form['elements'].forEach((element: object) => {
            // If the element doesn't have property `validate`, return.
            if (!element.hasOwnProperty('validate')) {
                return;
            }

            // Push element id and validation criteria to the list to test.
            this.validationsToMake.push({
                element: element['attributes']['id'],
                criteria: element['validate'],
            });

            if (element.hasOwnProperty('elements')) {
                this.sortValidations(element);
            }

            return;
        });
    }

    /**
     * Method to test element value is at least X length.
     * @param {string} element - element id.
     * @param {string} criteria - testing criteria to get min length.
     * @return {object}
     */
    private testMinLength(element: string, criteria: string): object
    {
        // Get min length by splitting criteria into an array by `:`. The second
        // array value will be our min length.
        const criteriaValue = parseInt(criteria.split(':')[1]);

        // If the element value length is less than the min length...
        if (document.getElementById(element)['value'].length  < criteriaValue) {
            // Return failed validation.
            return {
                passed: false,
                failed: `${element.charAt(0).toUpperCase() + element.slice(1)} must be at least ${criteriaValue} characters!`
            };
        }

        // Else return passed validation.
        return { passed: true, failed: '' };
    }

    /**
     * Method to test element value is not longer than X length.
     * @param {string} element - element id.
     * @param {string} criteria - testing criteria to get max length.
     * @return {object}
     */
    private testMaxLength(element: string, criteria: string): object
    {
        // Get max length by splitting criteria into an array by `:`. The second
        // array value will be our max length.
        const criteriaValue = parseInt(criteria.split(':')[1]);

        // If the element value length is less than the min length...
        if (document.getElementById(element)['value'].length  > criteriaValue) {
            // Return failed validation.
            return {
                passed: false,
                failed: `${element.charAt(0).toUpperCase() + element.slice(1)} must be no more than ${criteriaValue} characters!`
            };
        }

        // Else return passed validation.
        return { passed: true, failed: '' };
    }

    /**
     * Method to test that the element value is an email.
     * @param {string} element - element id
     * @return {object}
     */
    private testIsEmail(element: string): object
    {
        // Get element value...
        const criteriaValue = document.getElementById(element)['value'];

        // Regex from: https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
        if (/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(criteriaValue) === false) {
            // Return failed validation.
            return {
                passed: false,
                failed: `${element.charAt(0).toUpperCase() + element.slice(1)} must be a valid email!`
            };
        }

        // Else return passed validation.
        return { passed: true, failed: '' };
    }

    /**
     * Method to test that the element value is not a disposable email.
     * @param {string} element - element id
     * @return {Promise<object>}
     */
    private async testIsDisposableEmail(element: string): Promise<object>
    {
        // Get the element value and split it by `@` into an array. The second
        // array element will be the domain to test.
        const criteriaValue = document.getElementById(element)['value'].split('@')[1];

        /**
         * Then we'll call an API which will check an up to date disposable email
         * database for the passed email domain.
         * @/// <reference path="https://github.com/ivolo/disposable-email-domains"/>
         */
        const result = await fetch(`https://open.kickbox.com/v1/disposable/${criteriaValue}`)
            .then(response => response.json())
            .then(data => {
                return (data.disposable === true) ?
                {
                    passed: false,
                    failed: `${element.charAt(0).toUpperCase() + element.slice(1)} must not be a disposable email!`
                } :
                {
                    passed: true,
                    failed: ''
                }
            })
        ;

        return Promise.resolve(result);
    }

    /**
     * Method to test that the element value has a number.
     * @param {string} element - element id
     * @return {object}
     */
    private testHasNumber(element: string): object
    {
        // Get element value...
        const criteriaValue = document.getElementById(element)['value'];

        // Test if element value contains a number.
        if (/\d/.test(criteriaValue) === false) {
            // Return failed validation.
            return {
                passed: false,
                failed: `${element.charAt(0).toUpperCase() + element.slice(1)} must contain a number!`
            };
        }

        // Else return passed validation.
        return { passed: true, failed: '' };
    }

    /**
     * Method to test that the element value has a symbol.
     * @param {string} element - element id
     * @return {object}
     */
    private testHasSymbol(element: string): object
    {
        // Get element value...
        const criteriaValue = document.getElementById(element)['value'];

        // Test if the element value contains a symbol.
        if (/[!@#$£%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(criteriaValue) === false) {
            // Return failed validation.
            return {
                passed: false,
                failed: `${element.charAt(0).toUpperCase() + element.slice(1)} must contain a symbol!`
            };
        }

        // Else return passed validation.
        return { passed: true, failed: '' };
    }

    /**
     * Method to test that the element value has a capital letter.
     * @param {string} element - element id
     * @return {object}
     */
    private testHasCapital(element: string): object
    {
        // Get element value...
        const criteriaValue = document.getElementById(element)['value'];

        // Test if element value has a capital letter.
        if (/[A-Z]/.test(criteriaValue) === false) {
            // Return failed validation.
            return {
                passed: false,
                failed: `${element.charAt(0).toUpperCase() + element.slice(1)} must contain a capital letter!`
            };
        }

        // Else return passed validation.
        return { passed: true, failed: '' };
    }

    /**
     * Method to test an element value has been entered as the passed element
     * is required.
     * @param {string} element - element id.
     * @return {object}
     */
    private testRequired(element: string): object
    {
        // Get element value...
        const criteriaValue = document.getElementById(element)['value'];

        // Test if element value length is 0.
        if (criteriaValue.length <= 0) {
            // Return failed validation.
            return {
                passed: false,
                failed: `${element.charAt(0).toUpperCase() + element.slice(1)} is required and can't be submitted empty!`
            };
        }

        // Else return passed validation.
        return { passed: true, failed: '' };
    }
}
