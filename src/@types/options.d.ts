/**
 * FormJS top-level option types.
 */
declare interface FormJSOptions {
    ref: string,
    el: string,
    form: string|FormObject,
    onsubmit: OnsubmitObject,
    created: undefined|Function,
    beforeMount: undefined|Function,
    mounted: undefined|Function,
}

/**
 * Form object option types.
 */
declare interface FormObject {
    id: string,
    elements: Array<FormObjectElements>,
}

/**
 * Form object elements types.
 */
declare interface FormObjectElements {
    id: string,
    el: string,
    text: undefined|string,
    attributes: FormObjectElementAttributes,
    elements: Array<FormObjectElements>,
    validate: undefined|string,
}

/**
 * Form object elements attributes types.
 */
declare interface FormObjectElementAttributes {
    id: string
}

/**
 * Onsubmit object option types.
 */
declare interface OnsubmitObject {
    method: string,
    url: string,
    headers: undefined|object,
    includeFormData: undefined|boolean,
    before: undefined|Function,
    success: undefined|Function,
    error: undefined|Function,
}
