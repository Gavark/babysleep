/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Install_Step_GetInputs */

const fr_landing_install_step_get = /** @type {(inputs: Landing_Install_Step_GetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Récupérer`)
};

const en_landing_install_step_get = /** @type {(inputs: Landing_Install_Step_GetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fetch`)
};

/**
* | output |
* | --- |
* | "Fetch" |
*
* @param {Landing_Install_Step_GetInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_install_step_get = /** @type {((inputs?: Landing_Install_Step_GetInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Install_Step_GetInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_install_step_get(inputs)
	return en_landing_install_step_get(inputs)
});