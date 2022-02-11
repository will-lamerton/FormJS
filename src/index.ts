import { Library } from './lib/library';
import { Options } from './lib/options';
import { Instance } from './lib/instance';
import { Validator } from './lib/validator';

/**
 * FormJS library entry point.
 */
export class FormJS
{
    options: FormJSOptions;
    instances: Array<Instance> = [];

    // One line methods...
    validate: object = (el: string, rules: string) => new Validator().test({ el: el, rules: rules });
    version = (): string => Library.version;
    getInstances = (): Array<Instance> => [...this.instances];
    error = (error: string): void => console.error(`[${Library.name.toUpperCase()} ERROR] ${error}`);

    /**
     * Constructor
     */
    constructor()
    {
        window.__FORMJS__ = this;
    }

    /**
     * Constructor to initialise the form instance.
     * @param {Options} options - FormJS options.
     * @return {Instance}
     */
    create = (options: FormJSOptions): Instance|MakeInstanceFailed =>
    {
        // Let's start creating the form...
        try {
            // Test options are as they need to be via the `Test` class.
            Options.test(options, this.instances);

            // Init a new instance.
            const instance = new Instance(
                options.ref,
                options.el,
                options.form,
                options.onsubmit,
                options.created,
                options.beforeMount,
                options.mounted
            );

            // Let's set our options so they're accessible in other API functions.
            this.options = options;

            // Lets push the created instance to the instances array so it can be
            // accessed and modified.
            this.instances.push(instance);

            // Return instance.
            return instance;
        }

        /**
         * Error handling is done here for anything that went wrong above...
         * @param {string} e
         */
        catch(e) {
            // Throw error at time of failure.
            this.error(e);

            // Return an object with `mount` method which again, logs an error
            // should it be called.
            return {
                mount() {
                    window.__FORMJS__.error('You can\'t mount an instance which failed to create.');
                }
            }
        }
    }
}
