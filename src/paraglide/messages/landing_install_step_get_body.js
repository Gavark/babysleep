/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Install_Step_Get_BodyInputs */

const fr_landing_install_step_get_body = /** @type {(inputs: Landing_Install_Step_Get_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copiez docker-compose.yml et .env.example depuis le dépôt.`)
};

const en_landing_install_step_get_body = /** @type {(inputs: Landing_Install_Step_Get_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy docker-compose.yml and .env.example from the repository.`)
};

/**
* | output |
* | --- |
* | "Copy docker-compose.yml and .env.example from the repository." |
*
* @param {Landing_Install_Step_Get_BodyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_install_step_get_body = /** @type {((inputs?: Landing_Install_Step_Get_BodyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Install_Step_Get_BodyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_install_step_get_body(inputs)
	return en_landing_install_step_get_body(inputs)
});