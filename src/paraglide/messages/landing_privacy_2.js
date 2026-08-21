/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Privacy_2Inputs */

const fr_landing_privacy_2 = /** @type {(inputs: Landing_Privacy_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun analytics, aucun script tiers, aucune requête sortante.`)
};

const en_landing_privacy_2 = /** @type {(inputs: Landing_Privacy_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No analytics, no third-party script, no outbound request.`)
};

/**
* | output |
* | --- |
* | "No analytics, no third-party script, no outbound request." |
*
* @param {Landing_Privacy_2Inputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_privacy_2 = /** @type {((inputs?: Landing_Privacy_2Inputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Privacy_2Inputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_privacy_2(inputs)
	return en_landing_privacy_2(inputs)
});