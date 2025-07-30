// src/utils/formatters.js

/*
 * Formats the mileage number, adding spaces as thousands separators for the Ukrainian locale. | Форматує число пробігу, додаючи пробіли як роздільники тисяч для української локалі.
 * Returns an empty string if the value is missing or invalid. | Повертає порожній рядок, якщо значення відсутнє або недійсне.
 * @param {number | string | null | undefined} mileage - Mileage value. | Значення пробігу.
 * @returns {string} Formatted mileage line or empty line. | Відформатований рядок пробігу або порожній рядок.
 */
export const formatMileage = (mileage) => {
  if (mileage === null || mileage === undefined || mileage === "") {
    return "";
  }
  return new Intl.NumberFormat("uk-UA").format(Number(mileage));
};
