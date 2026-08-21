/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Footer_LicenseInputs */

const fr_landing_footer_license = /** @type {(inputs: Landing_Footer_LicenseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Publié sous licence AGPL-3.0.`)
};

const en_landing_footer_license = /** @type {(inputs: Landing_Footer_LicenseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Released under the AGPL-3.0 licence.`)
};

/**
* | output |
* | --- |
* | "Released under the AGPL-3.0 licence." |
*
* @param {Landing_Footer_LicenseInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_footer_license = /** @type {((inputs?: Landing_Footer_LicenseInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Footer_LicenseInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_footer_license(inputs)
	return en_landing_footer_license(inputs)
});