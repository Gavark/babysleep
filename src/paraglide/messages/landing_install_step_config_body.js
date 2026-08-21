/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Install_Step_Config_BodyInputs */

const fr_landing_install_step_config_body = /** @type {(inputs: Landing_Install_Step_Config_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Renseignez SESSION_SECRET, ADMIN_EMAIL et ADMIN_PASSWORD.`)
};

const en_landing_install_step_config_body = /** @type {(inputs: Landing_Install_Step_Config_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fill in SESSION_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD.`)
};

/**
* | output |
* | --- |
* | "Fill in SESSION_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD." |
*
* @param {Landing_Install_Step_Config_BodyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_install_step_config_body = /** @type {((inputs?: Landing_Install_Step_Config_BodyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Install_Step_Config_BodyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_install_step_config_body(inputs)
	return en_landing_install_step_config_body(inputs)
});