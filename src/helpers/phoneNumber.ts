export function cleanPhoneNumber(
  phone: string | null | undefined,
  resultFormat: '628' | '08' | '8' = '08',
) {
  if (!phone) {
    return null;
  }
  phone = phone.replace(/\/r/g, ' ');
  if (resultFormat === '628') {
    if (phone.startsWith('62')) {
      //
    } else if (phone.startsWith('08')) {
      phone = '62' + phone.substring(1, phone.length);
    } else if (phone.startsWith('8')) {
      phone = '62' + phone;
    }
    return phone;
  } else if (resultFormat === '08') {
    if (phone.startsWith('62')) {
      phone = '0' + phone.substring(2, phone.length);
    } else if (phone.startsWith('08')) {
      //
    } else if (phone.startsWith('8')) {
      phone = '0' + phone;
    }
    return phone;
  } else if (resultFormat === '8') {
    if (phone.startsWith('62')) {
      phone = phone.substring(2, phone.length);
    } else if (phone.startsWith('08')) {
      phone = phone.substring(1, phone.length);
    } else if (phone.startsWith('8')) {
      //
    }
    return phone;
  }
  return phone;
}
