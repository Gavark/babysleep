/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ from: NonNullable<unknown>, to: NonNullable<unknown> }} Age_Bracket_MonthsInputs */

const fr_age_bracket_months = /** @type {(inputs: Age_Bracket_MonthsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.from}-${i?.to} mois`)
};

const en_age_bracket_months = /** @type {(inputs: Age_Bracket_MonthsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.from}-${i?.to} months`)
};

/**
* | output |
* | --- |
* | "{from}-{to} months" |
*
* @param {Age_Bracket_MonthsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_bracket_months = /** @type {((inputs: Age_Bracket_MonthsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Bracket_MonthsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_bracket_months(inputs)
	return en_age_bracket_months(inputs)
});