/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Stats_BodyInputs */

const fr_landing_feat_stats_body = /** @type {(inputs: Landing_Feat_Stats_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Heure de réveil, durée des nuits, sommeil de jour, moyenne par sieste, sur la période de votre choix.`)
};

const en_landing_feat_stats_body = /** @type {(inputs: Landing_Feat_Stats_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wake time, night length, day sleep and average nap duration, over whatever range you pick.`)
};

/**
* | output |
* | --- |
* | "Wake time, night length, day sleep and average nap duration, over whatever range you pick." |
*
* @param {Landing_Feat_Stats_BodyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_stats_body = /** @type {((inputs?: Landing_Feat_Stats_BodyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Stats_BodyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_feat_stats_body(inputs)
	return en_landing_feat_stats_body(inputs)
});