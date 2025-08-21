export interface ApiErrorResponse {
  code: string;
  message: string;
}

export class CustomApiError<
  T extends string | ApiErrorResponse | object = string
> extends Error {
  public code: string;
  public errorData?: T;

  constructor(message: string, code: string = "UNKNOWN_ERROR", errorData?: T) {
    super(message);
    this.name = "CustomApiError";
    this.code = code;
    this.errorData = errorData;

    Object.setPrototypeOf(this, CustomApiError.prototype);
  }
}
