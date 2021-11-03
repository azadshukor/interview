export interface OrderPatchDTO {
  id: string;
  state: string;
}

export interface OrderCreateDTO {
  state: string;
  price: string;
  station: string;
}
