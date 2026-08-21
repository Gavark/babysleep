/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Share_BodyInputs */

const fr_landing_feat_share_body = /** @type {(inputs: Landing_Feat_Share_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'admin génère des liens d'invitation à durée limitée. Plusieurs bébés vivent sous le même compte.`)
};

const en_landing_feat_share_body = /** @type {(inputs: Landing_Feat_Share_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The admin issues time-limited invitation links. Several babies live under the same account.`)
};

/**
* | output |
* | --- |
* | "The admin issues time-limited invitation links. Several babies live under the same account." |
*
* @param {Landing_Feat_Share_BodyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_share_body = /** @type {((inputs?: Landing_Feat_Share_BodyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Share_BodyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_feat_share_body(inputs)
	return en_landing_feat_share_body(inputs)
});