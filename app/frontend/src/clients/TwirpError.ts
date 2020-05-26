type TwirpErrorOptions = {
  code: string;
  msg: string;
  meta: { [key: string]: string };
};

export class TwirpError extends Error {
  readonly code: string;
  readonly meta: { [key: string]: string };

  constructor({ code, msg, meta }: TwirpErrorOptions) {
    super(msg);
    Object.setPrototypeOf(this, new.target.prototype);
    this.code = code;
    this.meta = meta;
    this.name = this.constructor.name;
  }
}
