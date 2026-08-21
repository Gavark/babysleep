/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Privacy_1Inputs */

const fr_landing_privacy_1 = /** @type {(inputs: Landing_Privacy_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un seul fichier SQLite, sur le volume Docker que vous contrôlez.`)
};

const en_landing_privacy_1 = /** @type {(inputs: Landing_Privacy_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A single SQLite file, on the Docker volume you control.`)
};

/**
* | output |
* | --- |
* | "A single SQLite file, on the Docker volume you control." |
*
* @param {Landing_Privacy_1Inputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_privacy_1 = /** @type {((inputs?: Landing_Privacy_1Inputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Privacy_1Inputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_privacy_1(inputs)
	return en_landing_privacy_1(inputs)
});