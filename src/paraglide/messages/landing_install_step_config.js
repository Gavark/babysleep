/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Install_Step_ConfigInputs */

const fr_landing_install_step_config = /** @type {(inputs: Landing_Install_Step_ConfigInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configurer`)
};

const en_landing_install_step_config = /** @type {(inputs: Landing_Install_Step_ConfigInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configure`)
};

/**
* | output |
* | --- |
* | "Configure" |
*
* @param {Landing_Install_Step_ConfigInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_install_step_config = /** @type {((inputs?: Landing_Install_Step_ConfigInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Install_Step_ConfigInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_install_step_config(inputs)
	return en_landing_install_step_config(inputs)
});