import { GInputs, ImageFileAll, ValidationSet } from '../clazzes/ValidatorSet';

export const MyFormValidation: GInputs[] = [ValidationSet.file('fname', ImageFileAll)];
