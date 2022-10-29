<template>
    <label class="form-label">{{ label }}</label>
    <select v-bind="$attrs" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" class="form-select">
        <option v-for="option in options" :value="option.id" :key="option.id">{{option.name}}</option>
    </select>
</template>
<script>
    export default {
        props: {
            label: {
                type: String,
                default: ''
            },
            modelValue: {
                type: [String, Number],
                default: ''
            },
            options: {
                type: Array,
                required: true
            }
        }
    }
</script>