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
