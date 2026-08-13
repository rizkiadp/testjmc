import { createError } from 'h3';

export function validateTunjanganSetting(data) {
  const errors = {};

  const tarif = parseFloat(data.tarif_per_km);
  if (isNaN(tarif) || tarif <= 0) {
    errors.tarif_per_km = 'Tarif per KM (Base Fare) harus berupa angka positif lebih besar dari 0';
  }

  if (!data.berlaku_mulai || isNaN(Date.parse(data.berlaku_mulai))) {
    errors.berlaku_mulai = 'Tanggal Berlaku Mulai wajib diisi dengan format tanggal yang valid (YYYY-MM-DD)';
  }

  const minKm = parseInt(data.min_km);
  if (isNaN(minKm) || minKm < 0) {
    errors.min_km = 'Minimum Jarak (KM) harus berupa angka non-negatif (>= 0)';
  }

  const maxKm = parseInt(data.max_km);
  if (isNaN(maxKm) || maxKm <= 0) {
    errors.max_km = 'Maksimum Jarak (KM) harus berupa angka positif (> 0)';
  }

  if (!isNaN(minKm) && !isNaN(maxKm) && minKm >= maxKm) {
    errors.range_km = 'Minimum Jarak (KM) harus lebih kecil dari Maksimum Jarak (KM)';
  }

  const minHari = parseInt(data.min_hari_masuk);
  if (isNaN(minHari) || minHari < 1 || minHari > 31) {
    errors.min_hari_masuk = 'Minimum Hari Masuk Kerja harus berada dalam rentang 1 - 31 hari';
  }

  if (Object.keys(errors).length > 0) {
    const firstMessage = Object.values(errors)[0];
    throw createError({
      statusCode: 422,
      statusMessage: firstMessage,
      data: { errors }
    });
  }
}
