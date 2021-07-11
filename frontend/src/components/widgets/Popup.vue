<template>
    <transition name="slide-fade">
        <div class="bg-main-300 bg-opacity-90 fixed top-0 left-0 h-screen w-screen flex items-center justify-center z-100" @click="$emit('close-popup')">
            <div class="bg-main-100 w-96 p-4 px-5 rounded-lg text-white" @click.stop>
                <h1 class="text-xl font-bold">{{ title }}</h1>
                <slot>Error: no content provided</slot>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  emits: ['close-popup']
}
</script>
