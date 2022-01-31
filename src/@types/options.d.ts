/**
 * FormJS top-level option types.
 */
declare interface FormJSOptions {
    ref: string,
    el: string,
    form: string|FormObject,
    onsubmit: object,
    created: undefined|Function,
    beforeMount: undefined|Function,
    mounted: undefined|Function,
}

/**
 * Form object option types.
 */
declare interface FormObject {
    id: string,
    elements: Array<object>
}

/**
 * Onsubmit object option types.
 */
declare interface OnsubmitObject {
    type: string,
    url: string,
    before: undefined|Function,
    success: undefined|Function,
    error: undefined|Function,
}
