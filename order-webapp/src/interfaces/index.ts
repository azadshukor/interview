export interface ISelectComponent {
  prefix: string;
  items: string[];
  state: string;
  setState: (value: string) => void;
}

export interface IOrderBody {
  station: string;
  price: string;
}

export interface IOrderObj {
  id: string;
  station: string;
  price: string;
  state: string;
  created_at: string;
}

export interface IPatchOrderBody {
  id: string;
  state: string;
}
