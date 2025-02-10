export type ServiceResponseData = {
  success: boolean;
  code: string;
  payload: unknown;
};

export class ServiceResponse {
  protected readonly _success: boolean;
  protected readonly _code: string;
  protected readonly _payload: unknown;

  protected constructor(data: ServiceResponseData) {
    this._success = data.success;
    this._code = data.code;
    this._payload = data.payload;
  }

  public static make(props: ServiceResponseData): ServiceResponse {
    const serviceRequest = new ServiceResponse(props);
    return serviceRequest;
  }

  public isSuccess(): boolean {
    return this._success;
  }

  public getCode(): string {
    return this._code;
  }

  public isCode(code: string): boolean {
    return this._code === code;
  }

  public getPayload<Payload = undefined>(): Payload {
    return this._payload as Payload;
  }

  public getData(): ServiceResponseData {
    return {
      success: this._success,
      code: this._code,
      payload: this._payload,
    };
  }
}
