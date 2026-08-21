/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Install_Docs_LinkInputs */

const fr_landing_install_docs_link = /** @type {(inputs: Landing_Install_Docs_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lire la documentation complète`)
};

const en_landing_install_docs_link = /** @type {(inputs: Landing_Install_Docs_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read the full documentation`)
};

/**
* | output |
* | --- |
* | "Read the full documentation" |
*
* @param {Landing_Install_Docs_LinkInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_install_docs_link = /** @type {((inputs?: Landing_Install_Docs_LinkInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Install_Docs_LinkInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_install_docs_link(inputs)
	return en_landing_install_docs_link(inputs)
});