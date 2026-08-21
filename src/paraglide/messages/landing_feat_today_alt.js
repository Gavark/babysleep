/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Today_AltInputs */

const fr_landing_feat_today_alt = /** @type {(inputs: Landing_Feat_Today_AltInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vue Aujourd'hui : timer fenêtre d'éveil, budget de sommeil du jour et champs de saisie par sieste.`)
};

const en_landing_feat_today_alt = /** @type {(inputs: Landing_Feat_Today_AltInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Today view: wake-window timer, day sleep budget and per-nap input fields.`)
};

/**
* | output |
* | --- |
* | "Today view: wake-window timer, day sleep budget and per-nap input fields." |
*
* @param {Landing_Feat_Today_AltInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_today_alt = /** @type {((inputs?: Landing_Feat_Today_AltInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Today_AltInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_feat_today_alt(inputs)
	return en_landing_feat_today_alt(inputs)
});