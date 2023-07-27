import { ref } from 'vue';

export enum SidebarsType {
  PRIMARY = 'primary',
  LAYERS = 'layers',
}

const activeSidebar = ref<SidebarsType>(SidebarsType.PRIMARY)

export default function useSidebar() {
  const changeSidebar = (arg: SidebarsType) => activeSidebar.value = arg

  return {
    changeSidebar,
    activeSidebar
  }
}