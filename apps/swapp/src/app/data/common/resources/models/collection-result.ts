export type CollectionItemResult = {
  uid: string;
  name: string;
  url: string;
};

export type CollectionResult = {
  totalItems: number;
  totalPages: number;
  items: CollectionItemResult[];
};
