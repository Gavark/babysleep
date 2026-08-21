/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Stats_TitleInputs */

const fr_landing_feat_stats_title = /** @type {(inputs: Landing_Feat_Stats_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Des tendances, pas des impressions`)
};

const en_landing_feat_stats_title = /** @type {(inputs: Landing_Feat_Stats_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trends, not impressions`)
};

/**
* | output |
* | --- |
* | "Trends, not impressions" |
*
* @param {Landing_Feat_Stats_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_stats_title = /** @type {((inputs?: Landing_Feat_Stats_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Stats_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_feat_stats_title(inputs)
	return en_landing_feat_stats_title(inputs)
});