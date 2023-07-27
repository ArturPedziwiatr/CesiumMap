<script setup lang="ts">
import { PropType, ref } from 'vue'
import { InputType, InputMatcher } from '@Enum/InputType'
import { IErrorInput } from '@Interface/IError'

const props = defineProps({
  type: {
    type: String as PropType<InputType>,
    default: InputType.TEXT
  }
})
const emit = defineEmits(['model-value', 'onClick'])
const error = ref<IErrorInput>({ status: true, msg: ''})
const onClick = () => {
  if(error.value.status) {
    emit('onClick', input.value)
  }
}
const checkInput = () => {
  if (props.type === InputType.TEXT) return
  if (!input.value.match(InputMatcher[props.type])) {
    error.value.status = false
    error.value.msg = `Incorrect ${props.type}`
    return
  }
  error.value.status = true
  error.value.msg = ''
}
const input = ref('')
</script>

<template>
  <div class="wrapper">
    <Icon
      :icon="['fas', 'magnifying-glass']"
      @click="onClick()"
    />
    <input
      type="search"
      placeholder="Search..."
      v-model="input"
      @input="checkInput(); $emit('model-value', input)"
      @keydown.enter="onClick()"
    >
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  background: $primary-light-color;
  display: flex;
  padding: 0.7rem 0.5rem;
  border-radius: 6px;

  & input {
    height: 100%;
    width: 100%;
    outline: none;
    border: none;
    margin-left: 8px;
    background: $primary-light-color;

    &:focus {

    }
  }

  & svg {
    transition: $tran-03;

    &:hover {
      color: $primary-color;
    }
  }
}
</style>