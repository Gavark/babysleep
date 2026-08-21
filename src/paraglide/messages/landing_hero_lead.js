/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Hero_LeadInputs */

const fr_landing_hero_lead = /** @type {(inputs: Landing_Hero_LeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Siestes, nuits et fenêtres d'éveil dans une PWA que vous hébergez vous-même. Un fichier SQLite, aucun tiers.`)
};

const en_landing_hero_lead = /** @type {(inputs: Landing_Hero_LeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Naps, nights and wake windows in a PWA you host yourself. One SQLite file, no third party.`)
};

/**
* | output |
* | --- |
* | "Naps, nights and wake windows in a PWA you host yourself. One SQLite file, no third party." |
*
* @param {Landing_Hero_LeadInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_hero_lead = /** @type {((inputs?: Landing_Hero_LeadInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Hero_LeadInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_hero_lead(inputs)
	return en_landing_hero_lead(inputs)
});