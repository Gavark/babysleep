/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Mobile_TitleInputs */

const fr_landing_feat_mobile_title = /** @type {(inputs: Landing_Feat_Mobile_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pensée pour le téléphone`)
};

const en_landing_feat_mobile_title = /** @type {(inputs: Landing_Feat_Mobile_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Built for the phone`)
};

/**
* | output |
* | --- |
* | "Built for the phone" |
*
* @param {Landing_Feat_Mobile_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_mobile_title = /** @type {((inputs?: Landing_Feat_Mobile_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Mobile_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_feat_mobile_title(inputs)
	return en_landing_feat_mobile_title(inputs)
});