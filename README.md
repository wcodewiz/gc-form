# gc-form

a form state manager

**Note:** Make sure to create all validation logic on a global scope. Thank you.

## Usage

First Create a global file.. example **validation.tsx** using typescript paste the following code

```
import { GInputs, ImageFileAll, ValidationSet } from '../clazzes/ValidatorSet';

//this validation is set for an input with name fname
//must be an image file
//a mutiple file
export const MyFormValidation: GInputs[] = [ValidationSet.file('fname', ImageFileAll)];


```

### Usage

**Now inside your App.tsx**

```
/* @ts-ignore */
import React, { useContext, useEffect, useState } from 'react';
import { validate } from '../clazzes/ValidatorSet';
import { MyFormValidation } from './validations';

const App = () => {
    const [error, setErrors] = useState<{} | null>(null);

    return (
        <>
            <form name="myForm">
                <input type="file" multiple name="fname" placeholder="Your first Name" />
                {/* @ts-ignore */}
                {error && error.fname && <small>{error.fname[0]}</small>}
                <button
                    onClick={(ev) => {
                        ev.preventDefault();
                        //call the validation on submit
                        //param form name atttribute passed here
                        //validation created previously passed here
                        const validation = validate('myForm', MyFormValidation);
                        setErrors(validation.errors);
                    }}
                >
                    Submit
                </button>
            </form>
        </>
    );
};

export default App;

```

## RUN

**npm run dev** for vite

**npm start** for create-react-app

## Below are some of the valdation rules

```
ValidationSet.file("inputName",ImageFileAll,"errorOptional")  // input name, media type, optional error parameter

ValidationSet.required("inputName","errorOptional")  // input name,   optional error parameter

ValidationSet.min("inputName",min,"errorOptional")  // input name, min number,  optional error parameter

ValidationSet.max("inputName",max,"errorOptional")  // input name, max number,  optional error parameter

ValidationSet.email("inputName","errorOptional")  // input name,  optional error parameter

ValidationSet.phone("inputName", countryCode, areaCode, numberLength,"errorOptional")  // input name, media type, countryCode: number, areaCode: number[], numberLength: number,  optional error parameter

ValidationSet.url(name: string, error: string = 'invalid url')

ValidationSet.range(name: string, start: number, end: number, error?: string )

ValidationSet.address(name: string, error?: string)

ValidationSet.file(name: string, mimeType: string[], error?: string)

//mimeType can be any of the following array

ImageFileAll
ImageFileTransparent
ImageFileOpaque
ImageFileGif

//you can create your own mimeType


```

## Happy Hacking

## Authur

**Samuel Clinton**
