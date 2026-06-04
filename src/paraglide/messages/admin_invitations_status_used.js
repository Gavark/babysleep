/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_Status_UsedInputs */

const fr_admin_invitations_status_used = /** @type {(inputs: Admin_Invitations_Status_UsedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`utilisée`)
};

const en_admin_invitations_status_used = /** @type {(inputs: Admin_Invitations_Status_UsedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`used`)
};

/**
* | output |
* | --- |
* | "used" |
*
* @param {Admin_Invitations_Status_UsedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_status_used = /** @type {((inputs?: Admin_Invitations_Status_UsedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_Status_UsedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_status_used(inputs)
	return en_admin_invitations_status_used(inputs)
});