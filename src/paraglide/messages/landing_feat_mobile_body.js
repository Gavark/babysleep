/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Mobile_BodyInputs */

const fr_landing_feat_mobile_body = /** @type {(inputs: Landing_Feat_Mobile_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Installable depuis le navigateur. Sur petit écran, le calendrier passe en strip vertical.`)
};

const en_landing_feat_mobile_body = /** @type {(inputs: Landing_Feat_Mobile_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Installable straight from the browser. On a small screen the calendar becomes a vertical strip.`)
};

/**
* | output |
* | --- |
* | "Installable straight from the browser. On a small screen the calendar becomes a vertical strip." |
*
* @param {Landing_Feat_Mobile_BodyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_mobile_body = /** @type {((inputs?: Landing_Feat_Mobile_BodyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Mobile_BodyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_feat_mobile_body(inputs)
	return en_landing_feat_mobile_body(inputs)
});