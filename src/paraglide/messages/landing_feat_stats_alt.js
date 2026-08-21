/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Stats_AltInputs */

const fr_landing_feat_stats_alt = /** @type {(inputs: Landing_Feat_Stats_AltInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Page Stats : courbes de l'heure de réveil et de l'heure de coucher sur trente jours.`)
};

const en_landing_feat_stats_alt = /** @type {(inputs: Landing_Feat_Stats_AltInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stats page: wake-time and bedtime curves over thirty days.`)
};

/**
* | output |
* | --- |
* | "Stats page: wake-time and bedtime curves over thirty days." |
*
* @param {Landing_Feat_Stats_AltInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_stats_alt = /** @type {((inputs?: Landing_Feat_Stats_AltInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Stats_AltInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_feat_stats_alt(inputs)
	return en_landing_feat_stats_alt(inputs)
});