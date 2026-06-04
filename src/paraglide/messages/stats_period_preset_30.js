/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Period_Preset_30Inputs */

const fr_stats_period_preset_30 = /** @type {(inputs: Stats_Period_Preset_30Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`30 jours`)
};

const en_stats_period_preset_30 = /** @type {(inputs: Stats_Period_Preset_30Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`30 days`)
};

/**
* | output |
* | --- |
* | "30 days" |
*
* @param {Stats_Period_Preset_30Inputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_period_preset_30 = /** @type {((inputs?: Stats_Period_Preset_30Inputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Period_Preset_30Inputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_period_preset_30(inputs)
	return en_stats_period_preset_30(inputs)
});