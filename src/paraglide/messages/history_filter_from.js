/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Filter_FromInputs */

const fr_history_filter_from = /** @type {(inputs: History_Filter_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`De`)
};

const en_history_filter_from = /** @type {(inputs: History_Filter_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From`)
};

/**
* | output |
* | --- |
* | "From" |
*
* @param {History_Filter_FromInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_filter_from = /** @type {((inputs?: History_Filter_FromInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Filter_FromInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_filter_from(inputs)
	return en_history_filter_from(inputs)
});