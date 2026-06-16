/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Tooltip_NapsInputs */

const fr_age_rules_tooltip_naps = /** @type {(inputs: Age_Rules_Tooltip_NapsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nombre de siestes recommandé pour cet âge selon la littérature pédiatrique.`)
};

const en_age_rules_tooltip_naps = /** @type {(inputs: Age_Rules_Tooltip_NapsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Number of naps recommended at this age per pediatric literature.`)
};

/**
* | output |
* | --- |
* | "Number of naps recommended at this age per pediatric literature." |
*
* @param {Age_Rules_Tooltip_NapsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_tooltip_naps = /** @type {((inputs?: Age_Rules_Tooltip_NapsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Tooltip_NapsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_tooltip_naps(inputs)
	return en_age_rules_tooltip_naps(inputs)
});