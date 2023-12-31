export enum InputType {
  TEXT = 'text',
  URL = 'url'
}

export const InputMatcher = {
  [InputType.TEXT]: '',
  [InputType.URL]: '/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g'
}