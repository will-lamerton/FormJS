<p align='center'><img src='https://i.imgur.com/c8qrM6L.png' width='200px'/></p>

<h4 align='center'>A JavaScript framework for rendering and handling HTML forms. 📱</h4>

![npm version](https://img.shields.io/npm/v/formjs-framework?style=flat-square)

## Introduction
HTML forms are laborious – often repeating the same cocktail of creating DOM elements, handling events, input validation, requests, responses and more, all before the backend receives the request.

All of this *can* mean working in several files and languages which takes time and if your application is large enough, you risk creating unmaintainable code filled with different methods of creating and handling front-end forms.

FormJS aims to fix the above by providing an efficient, neat and declarative framework to easily create forms, validate inputs, handle requests and responses all from within your JavaScript. This makes your code simpler, more concise, predictable and in one place.

## Installation
You can install FormJS through NPM:

```js
npm install formjs-framework
```

## Usage
Then to initialise the framework simply import the script into your project through your desired method:

```js
// As a module...
import { FormJS } from 'formjs-framework';

// Require...
const FormJS = require('formjs-framework').FormJS;
```

And then create a FormJS instance that we can use to access the API and framework:

```js
const formjs = new FormJS;
```

From there we can make a new form instance by using the `create` method. This will take an `options` object and create a new instance.

```js
// Creates a new form instance...
const options = {...};
const newForm = formjs.create(options);
```

This creates the instance but for easier reactivity, you have to separately tell FormJS to mount and render the instance to the DOM. You do this through the `mount` method on the newly created form instance.

```js
// Creates a new form instance...
const options = {...};
const newForm = formjs.create(options);

// Mounts it!
newForm.mount();
```

You can also destroy an instance, removing it from the DOM and from FormJS's reference of instances. To do this, simply call the `destroy` method on the form instance.

```js
// Destroys instance.
newForm.destroy();
```

Sometimes we might just want to remove the form from the DOM but keep the instance. For this, you can use the `unmount` method. This will remove the form from the DOM but the form instance is still tracked by FormJS so you can easily call `mount` again to re-render.

```js
// Unmounts the instance.
newForm.unmount();
```

### Example
Below is a brief boilerplate of the above concepts that creates an empty form in the DOM with some submissions instructions.

This code imports FormJS, initialises it, creates a new form instance and then renders it. After 5 seconds, we then destroy the instance.

```js
import { FormJS } from 'formjs';

const formjs = new FormJS;

// Create a contact form...
const contactForm = formjs.create({
    ref: 'contactForm',
    el: 'contact-form-wrapper',

    form: {
        id: 'contact-form',
        elements: [... elements],
    },

    onsubmit: {
        type: 'POST',
        url: '/api/submit-form',
    },
});

contactForm.mount();

window.setTimeout(() => {
    contactForm.destroy();
}, 5000);
```

The resulting HTML before `destroy`:

```HTML
<!-- This element already exists. -->
<div id="contact-form-wrapper">
    <!-- This `form` element is generated by FormJS. -->
    <form id="contact-form"></form>
</div>
```

Pretty basic stuff in terms of what's rendered. However, behind the scenes FormJS has sorted everything and the form is ready to be manipulated.

## Options
FormJS comes pre-packaged with a number of options for creating forms, validating inputs, handling submissions and triggering events which can be accessed through adding to our `options` object passed to when creating a form instance.

### Required Options
Every created form instance *must* include the following in it's options:

| Option | Description |
|--------|-------------|
| `ref: string` | An internal FormJS reference to the instance. Think of this like a unique ID. |
| `form: string,object` | This is an object that describes our forms elements or an ID reference to a pre-existing form.|
| `onsubmit: object` | This is an object that describes what happens when our form is submitted. |

### Lifecycle Hooks
When you create a form instance, a number of lifecycle stages occur. You can get a callback from these by including hooks in the options:

```js
const form = formjs.create({
    ...options,

    created() {
        // Run this code when the form instance has been created.
    },

    beforeMount() {
        // Run this code *after* calling `mount` on the form but before any
        // elements are created or events bound.
    },

    mounted() {
        // Run this code when all elements are created and events are bound.
    }
});
```

### The `Form` Option
The `form` option can be passed as either an object, or a string.

As an object, the form option is passed to the library to describe what elements need to be created with what attributes. Here is also where we describe what form input validation is required.

When defining the `form` object, we *must* include an ID which gets rendered to the DOM. This is so FormJS can identify the form.

```js
const form = formjs.create({
    ...options,

    form: {
        id: 'new-form' // <- Required
    }
});
```

We must also pass an array of objects that describe the internal markup of the form. The objects inside the elements array use the following structure:

```js
const form = formjs.create({
    ...options,

    form: {
        id: 'new-form',

        elements: [ // <- Required
            {
                el: 'input', // <- Required | HTML element type.
                text: 'innerHTML', // <- Optional | Set innerHTML of element.

                attributes: { // <- Required | HTML attributes to add.
                    id: 'element-id' // <- Required | set input ID.
                    type: 'text',
                    name: 'foo bar',
                    placeholder: 'Foo bar'
                    foo: 'bar',
                },

                elements: [ // <- Optional | Repeat the above structure to nest elements in the form.
                    ...nestedElements
                ]
            },
        ]
    },
});
```

The above renders the below HTML:

```HTML
<div id="new-form-wrapper">
    <form id="new-form">
        <input type="text" name="foo bar" placeholder="Foo bar" foo="bar">
            innerHTML
            <!-- Nesting would occur here -->
        </input>
    </form>
</div>
```

Alternatively, you can create a form in your markup and then pass it's ID to the framework. FormJS can then take care of the rest. See the example below.

```html
<form id="new-form">
    <input id="foo" type="text" name="bar"></input>
    <input type="submit" value="Search"></input>
</form>

<script>
    const form = formjs.create({
        ...options,

        form: 'new-form', // <- This references the above form by ID that already exists.

        onsubmit: { // <- Required | FormJS binds to your form.
            type: 'POST',
            url: '/api',
        }
    });
</script>
```

### The `onsubmit` Option
The `onsubmit` option is passed to the library to describe what the form should do upon being submitted. It includes information about the type of request to make, where to make the request to and what should happen upon success or failure of the request.

When defining the `onsubmit` option we *must*  include a request type and URL. However, also included are some methods that will be called and ran upon success or failure. These are optional though. See the below example:

```js
const form = formjs.create({
    ...options,

    onsubmit: {
        type: 'POST', // <- Required | `GET` or `POST`
        url: '/url-to-send-request-to', // <- Required.
        includeFormData: true, // <- Optional | `true` or `false`. Defaults to `true`.

        before() {
            // Optional | Run this code before any request or validations are made.
        },

        /**
         * @param  {object} response - response from submission.
         */
        success(response) {
            // Run this code after the request is sent and a response indicating success is received.
        },

        /**
         * @param  {object|string} error - error message.
         * @param  {null|string} [source=null] - system where the error took place if available.
         */
        error(error, source = null) {
            // Run this code before or after the request is sent because of something going wrong. This could be a server or front-end error.
        }
    }
});
```

### Form Validation
Built into the library is also the ability to validate form inputs through pre-defined tests. If you want a form input to be validated you can do this by passing `validate` as a key inside the `form` objects `elements` array or by calling the `validate` method on the FormJS instance. Validations are passed as as a single string separated by a "|" for the library to parse. See the below examples:

As an option:

```js
const form = formjs.create({
    ...options,

    form: {
        id: 'new-form',

        elements: [
            {
                el: 'input',

                validate: 'minLength:5|hasNumber|hasSymbol',

                attributes: {
                    id: 'new-input',
                    type: 'text'
                }
            },
        ]
    },
});
```

As you can see, the above adds three validations that will be ran once the form is submitted and if any of them fail, the form won't submit and the `onsubmit` object `error` method will be called if it exists.

Alternatively you can call the `validate` method as part of the FormJS instance and make ad-hoc validations as you go. See the below example.

```html
<input id="foo"></input>

<script>
    const form = formjs.create({
        ...options,

        onsubmit: {
            ...options,

            before() {
                /**
                 * Validate an input...
                 * @param {string} el - ID of the element you wish to validate.
                 * @param {string} rules - Validation rules to test against.
                 * @return {Promise<object>} - Promise with a validation status object.
                 */
                formjs.validate('foo', 'hasCapital|hasSymbol').then(result => {
                    console.log(result) // Success.
                }).catch(result => {
                    console.log(result) // Error.
                });
            }
        }
    });
</script>
```

This way of validating will only return an output object for you as the user to handle.

A list of validations that can be used are below:

| Validation | Description |
|------------|-------------|
| `minLength:x` | Tests the length of the input value is *at least* x. |
| `maxLength:x` | Tests the length of the input value is *no more* than x. |
| `isEmail` | Tests if the value of the input is an email. |
| `isNotDisposableEmail` | FormJS has an inbuilt list of up to date disposable email domains. Add this validation to test if the value of the input is not equal to one of them. |
| `hasNumber` | Tests if the value of the input has *at least one* number. |
| `hasSymbol` | Tests if the value of the input has *at least one* symbol. |
| `hasCapital` | Tests if the value of the input has *at least one* capital letter. |
| `required` | Tests if the length of the input value *is not* 0. |


## API
Asides from the ones already mentioned, FormJS provides a library of API methods that you can call upon to help with front-end form handling. Below is a list.

### Global `FormJS` Instance
| Method | Arguments | Description |
|--------|-----------|-------------|
| `.create()` | `options: object` | Create a new form instance, returns a form instance. |
| `.version()` | None | Get the version of FormJS returned as a string. |
| `.validate()` | `el: string`, `rules: string` | Run an ad-hoc validation of a passed element (as an ID) against passed rules. Returns the result as a promise. |
| '.getInstances()' | None | Returns an array<Instance> of form instances. |

### Individual Form Instances
| Method | Arguments | Description |
|--------|-----------|-------------|
| `.mount()` | None | Mount the form instance, rendering it to the DOM. |
| `.destroy()` | None | Destroy the form instance, removing it from the DOM and FormJS altogether. |
| `.unmount()` | None | Remove the form from the DOM but keep the instance. |
| `.getInputValue()` | `elementId: string` | Get the value of a passed element by ID. Returns a string. |
| `.getAllElements()` | None | Returns an array an array<Elements> of all the form elements. |

## Roadmap 🛣
I built FormJS because of a need for it within my companies tech stack, a way to standardise forms to keep our codebases neat, predictable and written properly. However, we're always on a mission to ship products faster yet still keep them reliable and FormJS helps with that providing a lightweight framework to do all of the above.

Nevertheless, although I love dev and working on projects like this, for the moment, it can only be in my spare time. Be that as it may, I do have a list of features I would love to work as and when I can:

- `onsubmit` can be a method with completely optional code and this function is called if so.
- Add headers to `onsubmit` object.
- Front-end website if enough interest.
- More validations: This might be a good reference: https://laravel.com/docs/8.x/validation#available-validation-rules
- More testing coverage.
- Support for JSX-esque code for forms so either you can pass the form as a JSON object, or as HTML.
- Framework wrappers for Vue, React, Angular etc.

## Is This Framework Production Ready?
I would say use at your own discretion. The bottom line is that *it works*. However, I'm still increasing testing coverage and trialing the framework within my other projects and until that's done, I can't promise that FormJS will be entirely stable. I will keep this updated though.

## Contributing
In the spirit of open source, contributions are welcome! Please feel free to add to this repo through pull requests and issues.

**Here are a couple of dev details:**
- FormJS is written in TypeScript under the hood.
- Distribution is bundled with Rollup.
- Testing is done with Jest at the moment.
