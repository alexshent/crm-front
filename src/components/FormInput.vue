<template>
    <label class="form-label">{{ label }}</label>
    <input v-bind="$attrs" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)"
        autocomplete="off" class="form-control" />
</template>

<script>

// https://vuejs.org/guide/components/events.html#usage-with-v-model

// https://vuejs.org/api/built-in-directives.html#v-bind

export default {
    props: {
        label: {
            type: String,
            default: ''
        },
        modelValue: {
            type: [String, Number],
            default: ''
        }
    }
}
</script>