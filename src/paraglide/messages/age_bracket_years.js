/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ from: NonNullable<unknown>, to: NonNullable<unknown> }} Age_Bracket_YearsInputs */

const fr_age_bracket_years = /** @type {(inputs: Age_Bracket_YearsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.from}-${i?.to} ans`)
};

const en_age_bracket_years = /** @type {(inputs: Age_Bracket_YearsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.from}-${i?.to} years`)
};

/**
* | output |
* | --- |
* | "{from}-{to} years" |
*
* @param {Age_Bracket_YearsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_bracket_years = /** @type {((inputs: Age_Bracket_YearsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Bracket_YearsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_bracket_years(inputs)
	return en_age_bracket_years(inputs)
});