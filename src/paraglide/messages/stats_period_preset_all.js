/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Period_Preset_AllInputs */

const fr_stats_period_preset_all = /** @type {(inputs: Stats_Period_Preset_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tout`)
};

const en_stats_period_preset_all = /** @type {(inputs: Stats_Period_Preset_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All`)
};

/**
* | output |
* | --- |
* | "All" |
*
* @param {Stats_Period_Preset_AllInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_period_preset_all = /** @type {((inputs?: Stats_Period_Preset_AllInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Period_Preset_AllInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_period_preset_all(inputs)
	return en_stats_period_preset_all(inputs)
});