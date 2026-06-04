/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Stats_TitleInputs */

const fr_stats_title = /** @type {(inputs: Stats_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Statistiques — ${i?.name}`)
};

const en_stats_title = /** @type {(inputs: Stats_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Statistics — ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Statistics — {name}" |
*
* @param {Stats_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_title = /** @type {((inputs: Stats_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_title(inputs)
	return en_stats_title(inputs)
});