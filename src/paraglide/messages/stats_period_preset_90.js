/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Period_Preset_90Inputs */

const fr_stats_period_preset_90 = /** @type {(inputs: Stats_Period_Preset_90Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`90 jours`)
};

const en_stats_period_preset_90 = /** @type {(inputs: Stats_Period_Preset_90Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`90 days`)
};

/**
* | output |
* | --- |
* | "90 days" |
*
* @param {Stats_Period_Preset_90Inputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_period_preset_90 = /** @type {((inputs?: Stats_Period_Preset_90Inputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Period_Preset_90Inputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_period_preset_90(inputs)
	return en_stats_period_preset_90(inputs)
});