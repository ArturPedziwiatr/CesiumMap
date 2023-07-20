import { ref } from 'vue'

export class Inversify {
  private classBox: any;
  constructor() {
    this.classBox = {}
  }

  bind(className: string) {
    this.to = function (classToInject: any) {
      if (!this.classBox[className])
        this.classBox[className] = {
          classToInject,
          instance: null,
        }
    }

    this.toValue = function (classToInject: any) {
      if (!this.classBox[className])
        this.classBox[className] = {
          classToInject: null,
          instance: classToInject,
        }
    }

    return this
  }

  get(className: string) {
    const container = this.classBox[className]
    if (!container) return null
    if (container.classToInject && !container.instance) {
      if (container.withArgs)
        container.instance = new container.classToInject(...container.args)

      container.instance = new container.classToInject()
    }
    return container.instance
  }
}

export const container = ref(new Inversify())
