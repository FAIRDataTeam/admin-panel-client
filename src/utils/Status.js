const PENDING = 'LOADING'
const ERROR = 'ERROR'
const SUCCESS = 'SUCCESS'
const DEFAULT = 'DEFAULT'


export default class Status {
  constructor() {
    this.clear()
  }

  isPending() {
    return this._status === PENDING
  }

  isDefault() {
    return this._status === DEFAULT;
  }

  isError() {
    return this._status === ERROR
  }

  isSuccess() {
    return this._status === SUCCESS
  }

  get errorMsg() {
    return this._errorMsg
  }

  get successMsg() {
    return this._successMsg
  }

  setPending() {
    this.clear()
    this._status = PENDING
  }

  setError(msg) {
    this._status = ERROR
    this._errorMsg = msg
  }

  setDone(msg) {
    this._successMsg = msg
    this._status = msg ? SUCCESS : DEFAULT
  }

  clear() {
    this._status = DEFAULT
    this._errorMsg = null
    this._successMsg = null
  }


}