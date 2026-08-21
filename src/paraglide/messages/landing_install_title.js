/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Install_TitleInputs */

const fr_landing_install_title = /** @type {(inputs: Landing_Install_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Démarrer`)
};

const en_landing_install_title = /** @type {(inputs: Landing_Install_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Getting started`)
};

/**
* | output |
* | --- |
* | "Getting started" |
*
* @param {Landing_Install_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_install_title = /** @type {((inputs?: Landing_Install_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Install_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_install_title(inputs)
	return en_landing_install_title(inputs)
});