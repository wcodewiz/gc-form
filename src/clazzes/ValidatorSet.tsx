function empty(value: string | null | undefined) {
    return value === null || value === undefined ? '' : value;
}

export abstract class GInputs {
    public name: string;
    public error: string | null | undefined;
    public value: string | null | undefined;
    constructor() {
        this.name = '';
        this.value = null;
    }
    protected input(formName: string): HTMLInputElement {
        //@ts-ignore
        return document.forms[formName][this.name] as HTMLInputElement;
    }
    public abstract validate(formName: string): string;
}

class RequiredInput extends GInputs {
    public validate(formName: string): string {
        this.value = this.input(formName).value;
        return this.value !== null && this.value !== undefined && this.value?.trim().length > 0 ? '' : empty(this.error);
    }
    constructor(name: string, error: string | null | undefined) {
        super();
        this.name = name;
        this.error = error;
    }
}

class RangeInput extends GInputs {
    private start: number;
    private end: number;

    public validate(formName: string): string {
        this.value = this.input(formName).value;
        try {
            //@ts-ignore
            const amount: number = this.value as number;
            if (amount >= this.start && amount <= this.end) {
                return '';
            } else {
                return empty(this.error).replaceAll(':start', this.start.toString()).replaceAll(':end', this.end.toString());
            }
        } catch (e) {
            this.error = this.error;
        }
        return empty(this.error);
    }

    constructor(name: string, start: number, end: number, error: string) {
        super();
        this.name = name;
        this.start = start;
        this.end = end;
    }
}

class MinimuimInput extends GInputs {
    private min: number;
    public validate(formName: string): string {
        this.value = this.input(formName).value;
        return this.value !== null && this.value !== undefined && this.value?.trim().length >= this.min ? '' : empty(this.error).replace(':min', this.min.toString());
    }

    constructor(name: string, min: number = 1, error: string | null | undefined) {
        super();
        this.name = name;
        this.min = min;
        this.error = error;
    }
}

class MaximiumInput extends GInputs {
    private max: number;
    public validate(formName: string): string {
        this.value = this.input(formName).value;
        return this.value !== null && this.value !== undefined && this.value?.trim().length < this.max ? '' : empty(this.error).replace(':max', this.max.toString());
    }

    constructor(name: string, max: number = 1, error: string | null | undefined) {
        super();
        this.name = name;
        this.max = max;
        this.error = error;
    }
}

class EmailInput extends GInputs {
    public validate(formName: string): string {
        this.value = this.input(formName).value;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(`${this.value}`.trim()) ? '' : empty(this.error);
    }
    constructor(name: string, error: string | null | undefined) {
        super();
        this.name = name;
        this.error = error;
    }
}

class PhoneInput extends GInputs {
    public validate(formName: string): string {
        this.value = this.input(formName).value;

        return this.pattern.test(`${this.value}`) ? '' : empty(this.error);
    }
    public pattern: RegExp;

    constructor(name: string, code: number, areaCode: number[], length: number, error: string | null | undefined) {
        super();
        this.name = name;
        let areas = '';
        areaCode.forEach((e) => {
            if (areas === '') {
                areas = `${e}`;
            } else {
                areas.concat(`${areas}|${e}`);
            }
        });
        this.pattern = new RegExp(`^[${code}]+(${areas})+(\[0-9]{${length}})$`, 'g');
        this.error = error;
    }
}

class UrlInput extends GInputs {
    constructor(name: string, error: string | null | undefined) {
        super();
        this.name = name;
        this.error = error;
    }
    public validate(formName: string): string {
        this.value = this.input(formName).value;
        //@ts-ignore
        const pattern =
            /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
        return pattern.test(`${this.value}`.trim()) ? '' : empty(this.error);
    }
}

class AddressInput extends GInputs {
    constructor(name: string, error: string | null | undefined) {
        super();
        this.name = name;
        this.error = error;
    }

    public validate(formName: string): string {
        this.value = this.input(formName).value;

        this.value = `${this.value}`.replaceAll(/(\s)+(\,)/g, ',');
        this.value = `${this.value}`.replaceAll(/(\,)+(\s)/g, ',');
        this.value = `${this.value}`.replaceAll(',', ', ');

        //address patern '3344 W Alameda Avenue, Lakewood, CO 80222'
        var addressRegex = /^(\d{1,}) [a-zA-Z0-9\s]+(\,)? [a-zA-Z]+(\,)? [A-Z]{2,} [0-9]{5,6}$/;
        return addressRegex.test(`${this.value}`) ? '' : empty(this.error);
    }
}
class FileInput extends GInputs {
    private mimeType: string[];
    public validate(formName: string): string {
        //@ts-ignore
        const input = this.input(formName);
        var valid = true;
        if (input !== null) {
            const files: FileList = input.files as FileList;
            for (var i = 0; i < files.length; i++) {
                const file = files.item(i);
                var doesnotExist = true;
                this.mimeType.forEach((e) => {
                    if (file?.name.indexOf(e) !== -1) {
                        doesnotExist = false;
                    }
                });
                valid = !doesnotExist;
                if (!valid) break;
            }
        }
        return valid ? '' : empty(this.error).replaceAll(':expected', this.mimeType.join(','));
    }
    constructor(name: string, mimeType: string[], error: string | null | undefined) {
        super();
        this.name = name;
        this.mimeType = mimeType;
        this.error = error;
    }
}

export const ImageFileAll = ['jpg', 'png', 'gif', 'webp', 'bmp', 'jpeg'];
export const ImageFileTransparent = ['png', 'png2'];
export const ImageFileOpaque = ['jpg', 'gif', 'jpeg'];
export const ImageFileGif = ['gif'];

export class ValidationSet {
    public static required(name: string, error: string = 'This field is required'): GInputs {
        return new RequiredInput(name, error);
    }
    public static min(name: string, min: number, error: string = 'The minium length is :min'): GInputs {
        return new MinimuimInput(name, min, error);
    }
    public static max(name: string, max: number, error: string = 'The maximium length is :max'): GInputs {
        return new MaximiumInput(name, max, error);
    }
    public static email(name: string, error: string = 'invalid email address'): GInputs {
        return new EmailInput(name, error);
    }
    public static phone(name: string, countryCode: number, areaCode: number[], numberLength: number, error: string = 'invalid phone number'): GInputs {
        return new PhoneInput(name, countryCode, areaCode, this.length, error);
    }
    public static url(name: string, error: string = 'invalid url'): GInputs {
        return new UrlInput(name, error);
    }
    public static range(name: string, start: number, end: number, error: string = 'This field must be between :start and :end') {
        return new RangeInput(name, start, end, error);
    }
    public static address(name: string, error: string = 'invalid address combinations'): GInputs {
        return new AddressInput(name, error);
    }
    public static file(name: string, mimeType: string[], error: string = `invalid file type, expected :expected`): GInputs {
        return new FileInput(name, mimeType, error);
    }
}

export const validate = (formName: string, validations: GInputs[]) => {
    var errors = {};
    var valid = true;
    validations.forEach((input) => {
        const error = input.validate(formName);
        if (error !== '') {
            //@ts-ignore
            const value = errors[input.name];
            if (!value) {
                errors = { ...errors, [input.name]: [error] };
            } else {
                errors = { ...errors, [input.name]: [...value, error] };
            }
            valid = false;
        }
    });
    return { errors: errors, valid: valid };
};
