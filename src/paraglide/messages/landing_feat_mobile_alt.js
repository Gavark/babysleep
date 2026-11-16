/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Mobile_AltInputs */

const fr_landing_feat_mobile_alt = /** @type {(inputs: Landing_Feat_Mobile_AltInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calendrier sur mobile : une semaine, un jour par ligne, avec l'axe des heures.`)
};

const en_landing_feat_mobile_alt = /** @type {(inputs: Landing_Feat_Mobile_AltInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calendar on mobile: one week, one day per row, with the hour axis.`)
};

/**
* | output |
* | --- |
* | "Calendar on mobile: one week, one day per row, with the hour axis." |
*
* @param {Landing_Feat_Mobile_AltInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_mobile_alt = /** @type {((inputs?: Landing_Feat_Mobile_AltInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Mobile_AltInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_landing_feat_mobile_alt(inputs)
	return fr_landing_feat_mobile_alt(inputs)
});