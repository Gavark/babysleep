/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Tooltip_First_WindowInputs */

const fr_age_rules_tooltip_first_window = /** @type {(inputs: Age_Rules_Tooltip_First_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée d'éveil après le réveil du matin avant la première sieste. Généralement plus courte que les fenêtres suivantes.`)
};

const en_age_rules_tooltip_first_window = /** @type {(inputs: Age_Rules_Tooltip_First_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awake duration between morning wake and the first nap. Usually shorter than the windows between naps.`)
};

/**
* | output |
* | --- |
* | "Awake duration between morning wake and the first nap. Usually shorter than the windows between naps." |
*
* @param {Age_Rules_Tooltip_First_WindowInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_tooltip_first_window = /** @type {((inputs?: Age_Rules_Tooltip_First_WindowInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Tooltip_First_WindowInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_tooltip_first_window(inputs)
	return en_age_rules_tooltip_first_window(inputs)
});