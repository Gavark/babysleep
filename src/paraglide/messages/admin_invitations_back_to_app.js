/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_Back_To_AppInputs */

const fr_admin_invitations_back_to_app = /** @type {(inputs: Admin_Invitations_Back_To_AppInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Application`)
};

const en_admin_invitations_back_to_app = /** @type {(inputs: Admin_Invitations_Back_To_AppInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Application`)
};

/**
* | output |
* | --- |
* | "Application" |
*
* @param {Admin_Invitations_Back_To_AppInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_back_to_app = /** @type {((inputs?: Admin_Invitations_Back_To_AppInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_Back_To_AppInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_back_to_app(inputs)
	return en_admin_invitations_back_to_app(inputs)
});