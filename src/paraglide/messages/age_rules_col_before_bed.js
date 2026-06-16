/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Col_Before_BedInputs */

const fr_age_rules_col_before_bed = /** @type {(inputs: Age_Rules_Col_Before_BedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avant coucher`)
};

const en_age_rules_col_before_bed = /** @type {(inputs: Age_Rules_Col_Before_BedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Before bedtime`)
};

/**
* | output |
* | --- |
* | "Before bedtime" |
*
* @param {Age_Rules_Col_Before_BedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_col_before_bed = /** @type {((inputs?: Age_Rules_Col_Before_BedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Col_Before_BedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_col_before_bed(inputs)
	return en_age_rules_col_before_bed(inputs)
});