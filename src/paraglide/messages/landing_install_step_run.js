/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Install_Step_RunInputs */

const fr_landing_install_step_run = /** @type {(inputs: Landing_Install_Step_RunInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lancer`)
};

const en_landing_install_step_run = /** @type {(inputs: Landing_Install_Step_RunInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Run`)
};

/**
* | output |
* | --- |
* | "Run" |
*
* @param {Landing_Install_Step_RunInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_install_step_run = /** @type {((inputs?: Landing_Install_Step_RunInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Install_Step_RunInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_install_step_run(inputs)
	return en_landing_install_step_run(inputs)
});