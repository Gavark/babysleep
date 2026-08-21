/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Today_BodyInputs */

const fr_landing_feat_today_body = /** @type {(inputs: Landing_Feat_Today_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le réveil, chaque sieste, le coucher. Un timer live vous dit depuis combien de temps bébé est éveillé et quand caler la suivante.`)
};

const en_landing_feat_today_body = /** @type {(inputs: Landing_Feat_Today_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Morning wake-up, every nap, bedtime. A live timer shows how long the baby has been awake and when the next nap is due.`)
};

/**
* | output |
* | --- |
* | "Morning wake-up, every nap, bedtime. A live timer shows how long the baby has been awake and when the next nap is due." |
*
* @param {Landing_Feat_Today_BodyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_today_body = /** @type {((inputs?: Landing_Feat_Today_BodyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Today_BodyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_feat_today_body(inputs)
	return en_landing_feat_today_body(inputs)
});