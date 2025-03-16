/*eslint-disable  @typescript-eslint/naming-convention*/
export type DetailApiResult<TProperties> = {
  message: string;
  result: {
    properties: TProperties;
    description: string;
    _id: string;
    uid: string;
    __v: number;
  };
};
