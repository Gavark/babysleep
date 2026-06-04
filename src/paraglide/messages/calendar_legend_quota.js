/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ months: NonNullable<unknown>, total: NonNullable<unknown>, day: NonNullable<unknown>, night: NonNullable<unknown> }} Calendar_Legend_QuotaInputs */

const fr_calendar_legend_quota = /** @type {(inputs: Calendar_Legend_QuotaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quota recommandé pour ${i?.months} mois : ${i?.total} (${i?.day} siestes + ${i?.night} nuit)`)
};

const en_calendar_legend_quota = /** @type {(inputs: Calendar_Legend_QuotaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Recommended for ${i?.months} months: ${i?.total} (${i?.day} naps + ${i?.night} night)`)
};

/**
* | output |
* | --- |
* | "Recommended for {months} months: {total} ({day} naps + {night} night)" |
*
* @param {Calendar_Legend_QuotaInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_legend_quota = /** @type {((inputs: Calendar_Legend_QuotaInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Legend_QuotaInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_legend_quota(inputs)
	return en_calendar_legend_quota(inputs)
});