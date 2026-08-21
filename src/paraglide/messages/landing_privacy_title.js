/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Privacy_TitleInputs */

const fr_landing_privacy_title = /** @type {(inputs: Landing_Privacy_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Où vivent les données`)
};

const en_landing_privacy_title = /** @type {(inputs: Landing_Privacy_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Where the data lives`)
};

/**
* | output |
* | --- |
* | "Where the data lives" |
*
* @param {Landing_Privacy_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_privacy_title = /** @type {((inputs?: Landing_Privacy_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Privacy_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_privacy_title(inputs)
	return en_landing_privacy_title(inputs)
});