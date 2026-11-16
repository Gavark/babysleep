/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Mobile_BodyInputs */

const fr_landing_feat_mobile_body = /** @type {(inputs: Landing_Feat_Mobile_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Installable depuis le navigateur. Sur téléphone, une barre d'onglets en bas de l'écran et un calendrier jour par jour, regroupé par semaine.`)
};

const en_landing_feat_mobile_body = /** @type {(inputs: Landing_Feat_Mobile_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Installable straight from the browser. On a phone, a tab bar at the bottom of the screen and a day-by-day calendar grouped by week.`)
};

/**
* | output |
* | --- |
* | "Installable straight from the browser. On a phone, a tab bar at the bottom of the screen and a day-by-day calendar grouped by week." |
*
* @param {Landing_Feat_Mobile_BodyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_mobile_body = /** @type {((inputs?: Landing_Feat_Mobile_BodyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Mobile_BodyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_landing_feat_mobile_body(inputs)
	return fr_landing_feat_mobile_body(inputs)
});