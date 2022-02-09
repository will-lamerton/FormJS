/**
 * FormJS library options.
 */
export const Library = {
    name: 'FormJS',
    version: '1.0.9',
}

/**
 * FormJS options structure to test against.
 *
 * This object has an accessible `requiredOptions` method that returns the options
 * that must be passed in context with there accepted types and any other
 * nested required options.
 *
 * The `Test` object methods will traverse this object and test it's values.
 *
 */
export const RootOptionsStructure = {
    requiredOptions(type: null|string = null) {
        type;
        return [
            {
                option: 'ref',
                acceptedTypes: ['string'],
            },
            {
                option: 'el',
                acceptedTypes: ['string'],
                optional: true,
            },
            {
                option: 'form',
                acceptedTypes: ['object', 'string'],

                requiredOptions(type: null|string = null)  {
                    type;
                    return (type === 'string') ? [] : [
                        {
                            option: 'id',
                            acceptedTypes: ['string'],
                        },
                        {
                            option: 'elements',
                            acceptedTypes: ['object']
                        },
                    ];
                }
            },
            {
                option: 'onsubmit',
                acceptedTypes: ['object', 'Function'],

                requiredOptions(type: null|string = null)  {
                    type;
                    return [
                        {
                            option: 'type',
                            acceptedTypes: ['string'],
                        },
                        {
                            option: 'url',
                            acceptedTypes: ['string']
                        },
                        {
                            option: 'includeFormData',
                            acceptedTypes: ['boolean'],
                            optional: true,
                        },
                        {
                            option: 'before',
                            acceptedTypes: ['function', 'Function'],
                            optional: true,
                        },
                        {
                            option: 'success',
                            acceptedTypes: ['function', 'Function'],
                            optional: true,
                        },
                        {
                            option: 'error',
                            acceptedTypes: ['function', 'Function'],
                            optional: true,
                        },
                    ];
                }
            },
            {
                option: 'created',
                acceptedTypes: ['function', 'Function'],
                optional: true,
            },
            {
                option: 'beforeMount',
                acceptedTypes: ['function', 'Function'],
                optional: true,
            },
            {
                option: 'mounted',
                acceptedTypes: ['function', 'Function'],
                optional: true,
            }
        ];
    }
}

/**
 * FormJS Element Options structure to test against.
 *
 * This object has an accessible `requiredOptions` method that returns the options
 * that must be passed in context with there accepted types and any other
 * nested required options.
 *
 * The `Test` object methods will traverse this object and test it's values.
 *
 */
export const ElementOptionsStructure = {
    requiredOptions(type: null|string = null) {
        type;
        return [
            {
                option: 'el',
                acceptedTypes: ['string'],
            },
            {
                option: 'validate',
                acceptedTypes: ['string'],
                optional: true,
            },
            {
                option: 'attributes',
                acceptedTypes: ['object'],

                requiredOptions(type: null|string = null) {
                    type;
                    return [
                        {
                            option: 'id',
                            acceptedTypes: ['string'],
                        }
                    ]
                }
            }
        ]
    }
}
