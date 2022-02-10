import { FormJS } from '../index';

declare global {
    interface Window {
        __FORMJS__: FormJS;
    }

    interface HTMLElement {
        value: string
    }
}
