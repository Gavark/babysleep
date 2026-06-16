/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Col_LabelInputs */

const fr_age_rules_col_label = /** @type {(inputs: Age_Rules_Col_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tranche d'âge`)
};

const en_age_rules_col_label = /** @type {(inputs: Age_Rules_Col_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Age range`)
};

/**
* | output |
* | --- |
* | "Age range" |
*
* @param {Age_Rules_Col_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_col_label = /** @type {((inputs?: Age_Rules_Col_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Col_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_col_label(inputs)
	return en_age_rules_col_label(inputs)
});