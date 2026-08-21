/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Features_TitleInputs */

const fr_landing_features_title = /** @type {(inputs: Landing_Features_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce que l'app fait au quotidien`)
};

const en_landing_features_title = /** @type {(inputs: Landing_Features_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What the app does day to day`)
};

/**
* | output |
* | --- |
* | "What the app does day to day" |
*
* @param {Landing_Features_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_features_title = /** @type {((inputs?: Landing_Features_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Features_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_features_title(inputs)
	return en_landing_features_title(inputs)
});