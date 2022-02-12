/**
 * Class to validate form entries.
 */
export class Validator
{
    // Class variables.
    form: null|FormObject|string;
    formData: null|object;
    validationsToMake: Array<ValidationsToMake> = [];
    regexTests = [
        {
            // Regex from: https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
            name: 'isEmail',
            pattern: new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/),
            errorMessage: 'Input must be a valid email!'
        },
        {
            name: 'hasCapital',
            pattern: new RegExp(/[A-Z]/),
            errorMessage: 'Input must contain a capital letter!'
        },
        {
            name: 'hasSymbol',
            pattern: new RegExp(/[!@#$£%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/),
            errorMessage: 'Input must contain a symbol!'
        },
        {
            name: 'hasNumber',
            pattern: new RegExp(/\d/),
            errorMessage: 'Input must contain a number!'
        }
    ];
    passed = { passed: true, failed: '' };

    /**
     * Constructor
     * @param {null|FormObject|string} form - form object.
     * @param {null\object} formData - form data object.
     */
    constructor(form: null|FormObject|string = null, formData: null|object = null)
    {
        this.form = form;
        this.formData = formData;

        // If we have a form object, then we need to gather the form
        // validations required into an array to action.
        if (this.form !== null && typeof this.form !== 'string') {
            this.sortValidations(this.form);
        }
    }

    /**
     * Method to run validation tests.
     * @param {null|AdHocValidation} options - options { el: string, rules: string }
     * @return {Promise<Function>}
     */
    async test(options: null|AdHocValidation = null): Promise<Function>
    {
        // Sometimes the validation class will be used for ad-hoc validations
        // by passing an object. If one isn't passed though, we'll assume we're
        // testing all validations across a whole form...
        if (options !== null) {
            this.validationsToMake.push({
                element: options.el,
                criteria: options.rules,
            });
        }

        // Setting result structure up.
        let result: any = this.passed;

        // Create a new labelled `for` loop that then loops through every
        // validation to make.
        validationLayer: for (const validation of this.validationsToMake) {
            // Split validations down into an array of criteria.
            // Each criteria is seperated by `|`.
            const allCriteria = validation.criteria.split('|');

            // Get value value to validate.
            const value = document.getElementById(validation.element).value;

            // Then, loop through each criteria and match it to a test.
            for (const criteria of allCriteria) {
                if (criteria.includes('minLength:')) {
                    result = this.testMinLength(value, criteria)
                }
                else if (criteria.includes('maxLength:')) {
                    result = this.testMaxLength(value, criteria);
                }
                else if (criteria.includes('isEmail')) {
                    result = this.testRegex('isEmail', value);
                }
                else if (criteria.includes('isNotDisposableEmail')) {
                    await this.testIsDisposableEmail(value).then(response => result = response);
                }
                else if (criteria.includes('hasNumber')) {
                    result = this.testRegex('hasNumber', value);
                }
                else if (criteria.includes('hasSymbol')) {
                    result = this.testRegex('hasSymbol', value);
                }
                else if (criteria.includes('hasCapital')) {
                    result = this.testRegex('hasCapital', value);
                }
                else if (criteria.includes('required')) {
                    result = this.testRequired(value);
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
                if (result.passed === false) {
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
     * @param {FormObject|FormObjectElements} form - form object containing elements.
     * @return {void}
     */
    private sortValidations(form: any): void
    {
        // Loop through passed form object.
        form.elements.forEach((element: FormObjectElements) => {
            // If the element doesn't have property `validate`, return.
            if (!element.hasOwnProperty('validate')) {
                return;
            }

            // Push element id and validation criteria to the list to test.
            this.validationsToMake.push({
                element: element.attributes.id,
                criteria: element.validate,
            });

            if (element.hasOwnProperty('elements')) {
                this.sortValidations(element);
            }
        });
    }

    /**
     * Method to test element value is at least X length.
     * @param {string} value - element value.
     * @param {string} criteria - testing criteria to get min length.
     * @return {object}
     */
    private testMinLength(value: string, criteria: string): object
    {
        // Get min length by splitting criteria into an array by `:`. The second
        // array value will be our min length.
        const criteriaValue = parseInt(criteria.split(':')[1]);

        // If the element value length is less than the min length...
        return (value.length  < criteriaValue) ?
            // Return failed validation.
            {
                passed: false,
                failed: `Input must be at least ${criteriaValue} characters!`
            } :
            // Else return passed validation.
            this.passed
        ;
    }

    /**
     * Method to test element value is not longer than X length.
     * @param {string} value - element value.
     * @param {string} criteria - testing criteria to get max length.
     * @return {object}
     */
    private testMaxLength(value: string, criteria: string): object
    {
        // Get max length by splitting criteria into an array by `:`. The second
        // array value will be our max length.
        const criteriaValue = parseInt(criteria.split(':')[1]);

        // If the element value length is less than the min length...
        return (value.length  > criteriaValue) ?
            // Return failed validation.
            {
                passed: false,
                failed: `Input must be no more than ${criteriaValue} characters!`
            } :
            // Else return passed validation.
            this.passed
        ;
    }

    /**
     * Method to test that the element value is not a disposable email.
     * @param {string} value - element value
     * @return {Promise<object>}
     */
    private async testIsDisposableEmail(value: string): Promise<object>
    {
        // Get the element value and split it by `@` into an array. The second
        // array element will be the domain to test.
        const criteriaValue = value.split('@')[1];

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
                    failed: `Input must not be a disposable email!`
                } :
                this.passed
            })
        ;

        return Promise.resolve(result);
    }

    /**
     * Method to test element value against a regex based on predefined patterns
     * in class variable `regexTests`.
     * @param {string} testName - name of test name
     * @param {string} value - element value
     * @return {object}
     */
    private testRegex(testName: string, value: string): object
    {
        // Get correct validation.
        const validation = this.regexTests.filter(test => test.name === testName)[0];

        // Test if element value against pattern.
        return (new RegExp(validation.pattern).test(value) === false) ?
            // Return failed validation.
            {
                passed: false,
                failed: `${validation.errorMessage}`
            } :
            // Else return passed validation.
            this.passed
        ;
    }

    /**
     * Method to test an element value has been entered as the passed element
     * is required
     * @param {string} value - element value.
     * @return {object}
     */
    private testRequired(value: string): object
    {
        // Test if element value length is 0.
        return (value.length <= 0) ?
            // Return failed validation.
            {
                passed: false,
                failed: `Input is required and can't be submitted empty!`
            } :
            // Else return passed validation.
            this.passed
        ;
    }
}
