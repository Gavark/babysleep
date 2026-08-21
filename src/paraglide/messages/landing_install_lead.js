/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Install_LeadInputs */

const fr_landing_install_lead = /** @type {(inputs: Landing_Install_LeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Il vous faut Docker et Docker Compose v2. Rien d'autre.`)
};

const en_landing_install_lead = /** @type {(inputs: Landing_Install_LeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You need Docker and Docker Compose v2. Nothing else.`)
};

/**
* | output |
* | --- |
* | "You need Docker and Docker Compose v2. Nothing else." |
*
* @param {Landing_Install_LeadInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_install_lead = /** @type {((inputs?: Landing_Install_LeadInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Install_LeadInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_install_lead(inputs)
	return en_landing_install_lead(inputs)
});