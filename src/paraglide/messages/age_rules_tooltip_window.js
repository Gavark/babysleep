/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Tooltip_WindowInputs */

const fr_age_rules_tooltip_window = /** @type {(inputs: Age_Rules_Tooltip_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée d'éveil typique entre deux siestes successives dans la journée.`)
};

const en_age_rules_tooltip_window = /** @type {(inputs: Age_Rules_Tooltip_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Typical awake duration between two consecutive daytime naps.`)
};

/**
* | output |
* | --- |
* | "Typical awake duration between two consecutive daytime naps." |
*
* @param {Age_Rules_Tooltip_WindowInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_tooltip_window = /** @type {((inputs?: Age_Rules_Tooltip_WindowInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Tooltip_WindowInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_tooltip_window(inputs)
	return en_age_rules_tooltip_window(inputs)
});