/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Push_TitleInputs */

const fr_landing_feat_push_title = /** @type {(inputs: Landing_Feat_Push_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une alerte quand la fenêtre est dépassée`)
};

const en_landing_feat_push_title = /** @type {(inputs: Landing_Feat_Push_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An alert when the window is over`)
};

/**
* | output |
* | --- |
* | "An alert when the window is over" |
*
* @param {Landing_Feat_Push_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_push_title = /** @type {((inputs?: Landing_Feat_Push_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Push_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_feat_push_title(inputs)
	return en_landing_feat_push_title(inputs)
});