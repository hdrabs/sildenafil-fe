import dayjs from "dayjs";

export const formatDate = (date: string | Date, template = "MMM D, YYYY") =>
  dayjs(date).format(template);

export const formatDateTime = (date: string | Date) =>
  dayjs(date).format("MMM D, YYYY h:mm A");

export const formatCurrency = (cents: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    cents / 100,
  );

export const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
};
