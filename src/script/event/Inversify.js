class Inversify {
  constructor() {
    this.classBox = {}
  }

  bind(className) {
    this.to = function (classToInject) {
      if (!this.classBox[className]) 
        this.classBox[className] = {
          classToInject,
          instance: null,
          withArgs: false,
          args: null
        }
      this.withArgs = function (...args) {
        this.classBox[className].withArgs = true
        this.classBox[className].args = args
      }
      return this
    }

    this.toValue = function (classToInject) {
      if (!this.classBox[className])
        this.classBox[className] = {
          classToInject: null,
          instance: classToInject,
        }
    }

    return this
  }

  get(className) {
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

export const container = new Inversify()
