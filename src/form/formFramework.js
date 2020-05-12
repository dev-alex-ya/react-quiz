export function createControl(config, validation) {
  return {
    ...config,
    validation,
    valid: !validation,/* если правила валидации переданы, то изначально объект не валиден */
    touched: false,
    value: ''
  }
}