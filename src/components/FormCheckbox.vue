<template>
<label v-if="label" class="form-check-label">{{ label }}</label>
<input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" class="form-check-input" />
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: ''
        },
        modelValue: {
            type: Boolean,
            default: false
        }
    }
}
</script>