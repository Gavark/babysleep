/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Filter_ToInputs */

const fr_history_filter_to = /** @type {(inputs: History_Filter_ToInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À`)
};

const en_history_filter_to = /** @type {(inputs: History_Filter_ToInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To`)
};

/**
* | output |
* | --- |
* | "To" |
*
* @param {History_Filter_ToInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_filter_to = /** @type {((inputs?: History_Filter_ToInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Filter_ToInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_filter_to(inputs)
	return en_history_filter_to(inputs)
});