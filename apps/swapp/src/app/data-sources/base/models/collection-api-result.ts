export type CollectionItemApiResult = {
  uid: string;
  name: string;
  url: string;
};

export type CollectionApiResult = {
  message: string;
  totalRecords: number;
  totalPages: number;
  previous: string; // URI
  next: string; // URI
  results: CollectionItemApiResult[];
};
