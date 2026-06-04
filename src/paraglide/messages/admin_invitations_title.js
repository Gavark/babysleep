/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_TitleInputs */

const fr_admin_invitations_title = /** @type {(inputs: Admin_Invitations_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invitations`)
};

const en_admin_invitations_title = /** @type {(inputs: Admin_Invitations_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invitations`)
};

/**
* | output |
* | --- |
* | "Invitations" |
*
* @param {Admin_Invitations_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_title = /** @type {((inputs?: Admin_Invitations_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_title(inputs)
	return en_admin_invitations_title(inputs)
});