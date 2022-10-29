<template>
    <div class="dropdown">

        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {{ title }}
        </button>

        <nav class="dropdown-menu">
            <router-link v-for="[label, link] in map" :key='label' :to="link" class="dropdown-item">{{ label }}
            </router-link>
        </nav>

    </div>
</template>

<script>
export default {

    props: {
        title: String,
        map: Object
    },

    // setup(props) {
    //     console.log(props)
    // }
}
</script>