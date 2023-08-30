export interface IWMSList {
  name: string
  range?: number[]
  categories: string[]
  servers: Record<string, string[]> 
}

export interface IWMS {
  readonly url: string
  readonly layer: string
}