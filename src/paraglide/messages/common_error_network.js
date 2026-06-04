/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Error_NetworkInputs */

const fr_common_error_network = /** @type {(inputs: Common_Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Erreur réseau, réessaie.`)
};

const en_common_error_network = /** @type {(inputs: Common_Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Network error, please retry.`)
};

/**
* | output |
* | --- |
* | "Network error, please retry." |
*
* @param {Common_Error_NetworkInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
const common_error_network = /** @type {((inputs?: Common_Error_NetworkInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Error_NetworkInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_error_network(inputs)
	return en_common_error_network(inputs)
});
export { common_error_network as "common.error.network" }