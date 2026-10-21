export interface Product {
  readonly name: string;
  readonly price: number;
}

export interface LineItem {
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface ItemDetails {
  name: string;
  description: string;
  price: number;
  imageSrc: string;
}
