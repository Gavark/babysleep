/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Share_TitleInputs */

const fr_landing_feat_share_title = /** @type {(inputs: Landing_Feat_Share_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À deux, et pour plusieurs enfants`)
};

const en_landing_feat_share_title = /** @type {(inputs: Landing_Feat_Share_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`For two parents, and several children`)
};

/**
* | output |
* | --- |
* | "For two parents, and several children" |
*
* @param {Landing_Feat_Share_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_share_title = /** @type {((inputs?: Landing_Feat_Share_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Share_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_feat_share_title(inputs)
	return en_landing_feat_share_title(inputs)
});