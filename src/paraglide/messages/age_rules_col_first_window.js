/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Col_First_WindowInputs */

const fr_age_rules_col_first_window = /** @type {(inputs: Age_Rules_Col_First_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fenêtre d'éveil 1ʳᵉ sieste`)
};

const en_age_rules_col_first_window = /** @type {(inputs: Age_Rules_Col_First_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`First awake window`)
};

/**
* | output |
* | --- |
* | "First awake window" |
*
* @param {Age_Rules_Col_First_WindowInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_col_first_window = /** @type {((inputs?: Age_Rules_Col_First_WindowInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Col_First_WindowInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_col_first_window(inputs)
	return en_age_rules_col_first_window(inputs)
});