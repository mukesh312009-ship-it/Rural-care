// RuralCare Formatting Utilities

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2 $3');
};

export const formatAbhaNumber = (abha: string): string => {
  if (!abha) return '';
  return abha.replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
};

export const formatDate = (dateStr: string, locale: string = 'en'): string => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === 'ta' ? 'ta-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
};
