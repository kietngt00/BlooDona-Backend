import { Code, Message } from 'src/constants/response.constant';

export class Response {
  status: {
    status_code: string;
    status_message: string;
  };

  data: any;

  constructor(status_code, status_message, data=null) {
    this.status = { status_code, status_message };
    this.data = data;
  }
}

export class SuccessResponse extends Response {
  constructor(data = null) {
    super(Code.SUCCESS, Message.SUCCESS, data);
  }
}

export class InternalErrorResponse extends Response {
  constructor(data = null) {
    super(Code.INTERNAL_ERROR, Message.INTERNAL_ERROR, data);
  }
}

export class AuthFailResponse extends Response {
  constructor(data = null) {
    super(Code.AUTH_FAIL, Message.AUTH_FAIL, data);
  }
}

export class WrongInputResponse extends Response {
  constructor(data = null) {
    super(Code.WRONG_INPUT, Message.WRONG_INPUT, data);
  }
}

export class DuplicateResponse extends Response {
  constructor(data = null) {
    super(Code.DUPLICATE_DATA, Message.DUPLICATE_DATA, data);
  }
}

export class NotFoundResponse extends Response {
  constructor(data = null) {
    super(Code.NOT_FOUND, Message.NOT_FOUND, data);
  }
}

export class AdminProtectResponse extends Response {
  constructor(data = null) {
    super(Code.ADMIN_PROTECT, Message.ADMIN_PROTECT, data);
  }
}
