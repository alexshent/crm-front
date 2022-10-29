<template>
    <div id="pagination-div" class="d-flex justify-content-center">
        <nav aria-label="Page navigation">
            <ul class="pagination">
            <!-- first page -->
            <li v-if="currentPage > 1" class="page-item" @click.prevent="getPage(1)">
                <a class="page-link" href="#"><span><i class="bi bi-box-arrow-in-left"></i></span></a>
            </li>
            <!-- previous page 1 -->
            <li v-if="currentPage >= 2" class="page-item" @click.prevent="getPage(previousPage1)">
                <a class="page-link" href="#"><span><i class="bi bi-caret-left"></i></span></a>
            </li>
            <!-- previous page 2 -->
            <li v-if="currentPage >= 3" class="page-item" @click.prevent="getPage(previousPage2)">
                <a class="page-link" href="#">{{ previousPage2 }}</a>
            </li>
            <!-- previous page 1 -->
            <li v-if="currentPage >= 2" class="page-item" @click.prevent="getPage(previousPage1)">
                <a class="page-link" href="#">{{ previousPage1 }}</a>
            </li>
            <!-- current page -->
            <li class="page-item active" @click.prevent="currentPage(currentPage)">
                <a class="page-link" href="#">{{ currentPage }}</a>
            </li>
            <!-- next page 1 -->
            <li v-if="totalPages - currentPage > 0" @click.prevent="getPage(nextPage1)" class="page-item">
                <a class="page-link" href="#">{{ nextPage1 }}</a>
            </li>
            <!-- next page 2 -->
            <li v-if="totalPages - currentPage > 1" @click.prevent="getPage(nextPage2)" class="page-item">
                <a class="page-link" href="#">{{ nextPage2 }}</a>
            </li>
            <!-- next page 1 -->
            <li v-if="totalPages - currentPage > 0" class="page-item" @click.prevent="getPage(nextPage1)">
                <a class="page-link" href="#"><span><i class="bi bi-caret-right"></i></span></a>
            </li>
            <!-- last page -->
            <li v-if="currentPage < totalPages" class="page-item" @click.prevent="getPage(totalPages)">
                <a class="page-link" href="#"><span><i class="bi bi-box-arrow-in-right"></i></span></a>
            </li>
            </ul>
        </nav>
    </div>
    <div>
        <span>page {{ currentPage }} of {{ totalPages }}</span>
    </div>
</template>

<script>
import { computed } from 'vue';

export default {

    props: {
        pagination: Object,
        getPage: Function
    },

    setup(props) {

        let currentPage = computed(() => {
            return props.pagination.currentPage;
        });

        let nextPage1 = computed(() => {
            return props.pagination.currentPage + 1;
        });

        let nextPage2 = computed(() => {
            return props.pagination.currentPage + 2;
        });

        let previousPage1 = computed(() => {
            return props.pagination.currentPage - 1;
        });

        let previousPage2 = computed(() => {
            return props.pagination.currentPage - 2;
        });

        let totalPages = computed(() => {
            return Math.ceil(props.pagination.total / props.pagination.pageSize);
        });

        return {
            currentPage, nextPage1, nextPage2, previousPage1, previousPage2, totalPages,
        };
    }
}
</script>
