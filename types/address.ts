export interface Address {
  _id?: string;
  firstName: string;
  lastName?: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type AddressInput = Omit<Address, "_id">;