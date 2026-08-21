/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Today_TitleInputs */

const fr_landing_feat_today_title = /** @type {(inputs: Landing_Feat_Today_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une saisie par moment de la journée`)
};

const en_landing_feat_today_title = /** @type {(inputs: Landing_Feat_Today_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One entry per moment of the day`)
};

/**
* | output |
* | --- |
* | "One entry per moment of the day" |
*
* @param {Landing_Feat_Today_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_today_title = /** @type {((inputs?: Landing_Feat_Today_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Today_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_feat_today_title(inputs)
	return en_landing_feat_today_title(inputs)
});