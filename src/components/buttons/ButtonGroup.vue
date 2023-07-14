<script setup lang="ts">
import _ from 'lodash'

const id = _.uniqueId()
const emit = defineEmits(['onChange'])
const props = defineProps({
  type: {
    type: String,
    default: 'unique'
  }
})
const getType = (node: HTMLElement): string | null =>
  node && node.getAttribute(props.type)
    ? node.getAttribute(props.type)
    : node.parentElement
    ? getType(node.parentElement)
    : null

const click = (event: MouseEvent) => {
  const type = getType(event.target as HTMLElement)
  const node = document.getElementById(id)
  if (node) {
    Array.from(node.children).forEach(elem => {    
      const childType = (elem as HTMLElement).getAttribute(props.type)
      console.log(childType === type && !elem.getAttribute('active'));
      
      if (childType && childType === type && !elem.getAttribute('active'))
        (elem as HTMLElement).setAttribute('active', 'true')
      else (elem as HTMLElement).removeAttribute('active')
    })
  }

  if (type) emit('onChange', type)
}
</script>

<template>
  <div :id="id" class="wrapper" @click="e => click(e)">
    <slot />
  </div>
</template>
