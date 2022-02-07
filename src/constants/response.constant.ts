export enum Code {
  SUCCESS = 'S_001',
  INTERNAL_ERROR = 'F_001',
  AUTHORIZATION_PROTECT = 'F_002',
  AUTH_FAIL = 'F_003',
  WRONG_INPUT = 'F_004',
  DUPLICATE_DATA = 'F_005',
  NOT_FOUND = 'F_006',
}

export enum Message {
  SUCCESS = 'Request successfully',
  INTERNAL_ERROR = 'Internal Server Error',
  AUTHORIZATION_PROTECT = 'Authorization Protected',
  AUTH_FAIL = 'Authentication failed',
  WRONG_INPUT = 'Wrong Input Information',
  DUPLICATE_DATA = 'Duplicate Data',
  NOT_FOUND = 'Not Found',
}