import { Library } from './library';
import { RootOptionsStructure } from './library';
import { ElementOptionsStructure } from './library';

/**
 * A set of options testing functions for the library.
 *
 * These exist for more efficient and useful error reporting and library
 * stability.
 */
export const Options = {
    /**
     * Method to test all required options against all criteria.
     * @param {FormJSOptions} options - options object to test with.
     * @param {Array<object>} - current FormJS instances to test against.
     */
    test(options: FormJSOptions, instances: Array<object>)
    {
        // Test options exist and correct types on root options...
        this.testExistsAndTypes(options, RootOptionsStructure.requiredOptions());

        // Test `ref` and `el` are unique across all instances as long as they're
        // not `undefined`.
        if (options.ref !== undefined) {
            this.testIsUniqueInInstances('ref', instances, options.ref);
        }

        if (options.el !== undefined) {
            this.testIsUniqueInInstances('el', instances, options.el);
        }

        // If form is a string...
        if (typeof options.form === 'string') {
            // Test that the form is unique across all instances.
            this.testIsUniqueInInstances('form', instances, options.form);
        }
        // Else if an object with `elements` array longer than 0.
        else if (options.form.elements.length > 0) {
            // Loop these elements and test options and correct types in them.
            options.form.elements.forEach((element: object) => {
                this.testExistsAndTypes(element, ElementOptionsStructure.requiredOptions());
            });
        }
    },

    /**
     * Method to test if an option is unique in the library instances. This
     * is a useful because we don't always want repeating vital options. For
     * example, the same form being bound to twice.
     *
     * @param {string} context - context in regards to nesting in the options object.
     * @param {Array<object>} instances - the current FormJS instances.
     * @param {any} payload - option to test exists in context.
     * @return {void}
     * @throws {Error}
     */
    testIsUniqueInInstances(context: string, instances: Array<object>, payload: any): void
    {
        // Filter array by picking out matching payloads. If this new array has
        // a length greater than 1... then we have a match where we shouldn't.
        //
        // Throw an error in this case.
        if (instances.filter(instance => instance[context] === payload).length > 0) {
            throw `${Library.name} instance with \`${context}\`, \`${payload}\` is already in use.`;
        }
    },

    /**
     * Method to test the options passed against the structure the library
     * expects.
     *
     * @param {object} options - options passed by user.
     * @param {Array<object>} - requiredOptions - options structure that is required
     * by FormJS.
     * @param {null|string} context - optional context for options to specify nesting.
     * @return {void}
     * @throws {Error}
     */
    testExistsAndTypes(options: object, requiredOptions: Array<object>, context: null|string = null): void
    {
        // Check if we have a context and apply that immediately if so.
        options = (context !== null) ? options[context] : options;

        // Loop through our required options structure...
        requiredOptions.forEach((requiredOption: object) => {
            // First we'll check each required option is in the users options
            // *unless* it's optional...
            if (!options.hasOwnProperty(requiredOption['option']) && requiredOption['optional'] === undefined) {
                // Throwing an error if not present and not optional...
                throw `Option \`${requiredOption['option']}\` in context \`${JSON.stringify(options)}\` required to create new ${Library.name} instance.`;
            }

            // Then, we'll loop through our accepted types...
            let typesCorrect = false;
            requiredOption['acceptedTypes'].some((type: string) => {
                // ...Checking to see if each one matches the passed type *or*
                // the passed option doesn't exist in case we're testing an option
                // that's optional and could not be present.
                if (typeof options[requiredOption['option']] === type || !options.hasOwnProperty(requiredOption['option'])) {
                    // Exit out of loop if a type match has been made or
                    // we're skipping. This signifies the option has passed.
                    typesCorrect = true;
                    return typesCorrect;
                }
            });

            // After looping, we'll check if any types are incorrect throwing
            // an error if they are.
            if (typesCorrect === false) {
                throw `Option \`${requiredOption['option']}\` in context \`${JSON.stringify(options)}\` requires type(s) \`${requiredOption['acceptedTypes']}\`. Type \`${typeof options[requiredOption['option']]}\` received.`;
            }

            // Lastly, we'll test for nested required options inside the
            // current required options.
            if (requiredOption.hasOwnProperty('requiredOptions')) {
                // If they exist, re-run this method with updated context and
                // required options.
                this.testExistsAndTypes(
                    options,
                    requiredOption['requiredOptions'](typeof options[requiredOption['option']]),
                    requiredOption['option']
                );
            }

            // Once here, we're done testing the current context, return.
            return;
        });
    },
}
