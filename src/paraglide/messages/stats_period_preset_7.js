/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Period_Preset_7Inputs */

const fr_stats_period_preset_7 = /** @type {(inputs: Stats_Period_Preset_7Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`7 jours`)
};

const en_stats_period_preset_7 = /** @type {(inputs: Stats_Period_Preset_7Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`7 days`)
};

/**
* | output |
* | --- |
* | "7 days" |
*
* @param {Stats_Period_Preset_7Inputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_period_preset_7 = /** @type {((inputs?: Stats_Period_Preset_7Inputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Period_Preset_7Inputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_period_preset_7(inputs)
	return en_stats_period_preset_7(inputs)
});