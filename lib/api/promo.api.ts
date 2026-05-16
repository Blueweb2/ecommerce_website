import api from "./axios";

export const validatePromo = async (code: string, subtotal: number) => {
  const response = await api.post("/promo/validate", { code, subtotal });
  return response.data;
};
