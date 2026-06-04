/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_Status_ExpiredInputs */

const fr_admin_invitations_status_expired = /** @type {(inputs: Admin_Invitations_Status_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`expirée`)
};

const en_admin_invitations_status_expired = /** @type {(inputs: Admin_Invitations_Status_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`expired`)
};

/**
* | output |
* | --- |
* | "expired" |
*
* @param {Admin_Invitations_Status_ExpiredInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_status_expired = /** @type {((inputs?: Admin_Invitations_Status_ExpiredInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_Status_ExpiredInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_status_expired(inputs)
	return en_admin_invitations_status_expired(inputs)
});