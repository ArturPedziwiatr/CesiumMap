<script setup lang="ts">
import { PropType, ref } from 'vue'
import { InputType, InputMatcher } from '@Enum/InputType'
import { IErrorInput } from '@Interface/IError'

const props = defineProps({
  type: {
    type: String as PropType<InputType>,
    default: InputType.TEXT,
  },
  placeholder: {
    type: String,
    default: 'Search...',
  },
  icon: {
    type: String,
    required: false,
  }
})
const emit = defineEmits(['model-value', 'onClick'])
const error = ref<IErrorInput>({ status: true, msg: '' })
const onClick = () => {
  if (error.value.status) {
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
    <Icon v-if="icon" :icon="['fas', icon]" @click="onClick()" />
    <input
      type="search"
      :placeholder="placeholder"
      v-model="input"
      @input="checkInput(); $emit('model-value', input)"
      @keydown.enter="onClick()"
    />
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

    &[type="search"]::-webkit-search-cancel-button {
      -webkit-appearance: none;
      appearance: none;
      height: 10px;
      width: 10px;
      color: $primary-color;
      margin-left: 0.4rem;
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjEyMy4wNXB4IiBoZWlnaHQ9IjEyMy4wNXB4IiB2aWV3Qm94PSIwIDAgMTIzLjA1IDEyMy4wNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTIzLjA1IDEyMy4wNTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTEyMS4zMjUsMTAuOTI1bC04LjUtOC4zOTljLTIuMy0yLjMtNi4xLTIuMy04LjUsMGwtNDIuNCw0Mi4zOTlMMTguNzI2LDEuNzI2Yy0yLjMwMS0yLjMwMS02LjEwMS0yLjMwMS04LjUsMGwtOC41LDguNQ0KCQljLTIuMzAxLDIuMy0yLjMwMSw2LjEsMCw4LjVsNDMuMSw0My4xbC00Mi4zLDQyLjVjLTIuMywyLjMtMi4zLDYuMSwwLDguNWw4LjUsOC41YzIuMywyLjMsNi4xLDIuMyw4LjUsMGw0Mi4zOTktNDIuNGw0Mi40LDQyLjQNCgkJYzIuMywyLjMsNi4xLDIuMyw4LjUsMGw4LjUtOC41YzIuMy0yLjMsMi4zLTYuMSwwLTguNWwtNDIuNS00Mi40bDQyLjQtNDIuMzk5QzEyMy42MjUsMTcuMTI1LDEyMy42MjUsMTMuMzI1LDEyMS4zMjUsMTAuOTI1eiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=);
      background-size: 10px 10px;
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
