/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Col_NapsInputs */

const fr_age_rules_col_naps = /** @type {(inputs: Age_Rules_Col_NapsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Siestes prévues`)
};

const en_age_rules_col_naps = /** @type {(inputs: Age_Rules_Col_NapsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected naps`)
};

/**
* | output |
* | --- |
* | "Expected naps" |
*
* @param {Age_Rules_Col_NapsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_col_naps = /** @type {((inputs?: Age_Rules_Col_NapsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Col_NapsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_col_naps(inputs)
	return en_age_rules_col_naps(inputs)
});