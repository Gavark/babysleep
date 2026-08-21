/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Install_Step_Run_BodyInputs */

const fr_landing_install_step_run_body = /** @type {(inputs: Landing_Install_Step_Run_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'app écoute sur le port 3000, prête à passer derrière votre reverse proxy.`)
};

const en_landing_install_step_run_body = /** @type {(inputs: Landing_Install_Step_Run_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The app listens on port 3000, ready to sit behind your reverse proxy.`)
};

/**
* | output |
* | --- |
* | "The app listens on port 3000, ready to sit behind your reverse proxy." |
*
* @param {Landing_Install_Step_Run_BodyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_install_step_run_body = /** @type {((inputs?: Landing_Install_Step_Run_BodyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Install_Step_Run_BodyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_install_step_run_body(inputs)
	return en_landing_install_step_run_body(inputs)
});