/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Period_Preset_14Inputs */

const fr_stats_period_preset_14 = /** @type {(inputs: Stats_Period_Preset_14Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`14 jours`)
};

const en_stats_period_preset_14 = /** @type {(inputs: Stats_Period_Preset_14Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`14 days`)
};

/**
* | output |
* | --- |
* | "14 days" |
*
* @param {Stats_Period_Preset_14Inputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_period_preset_14 = /** @type {((inputs?: Stats_Period_Preset_14Inputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Period_Preset_14Inputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_period_preset_14(inputs)
	return en_stats_period_preset_14(inputs)
});