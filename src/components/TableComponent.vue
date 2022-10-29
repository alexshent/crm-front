<template>
    <div class="row">
        <div class="col-12">
            <h3>{{table.title}}</h3>
        </div>
    </div>

    <div class="row mb-3">
        <div class="col-1">
            <label>Bulk action</label>
            <select @change="bulkActionSelected">
                <option></option>
                <option v-for="[option] in table.bulkActions" :key="option" >{{option}}</option>
            </select>
        </div>
    </div>

    <div>
        <table class="table table-hover table-sm align-middle">
            <thead>
                <tr class="table-success small">
                    <th>
                        <input type="checkbox" @change="selectAll" class="form-check-input" />
                    </th>
                    <th class="align-middle" v-for="[field, f] in table.fields" :key='field'
                        @click="sortTable(field)">
                        {{ f.label }}
                        <i v-if="field === table.sortedBy" :class="table.iconClass" aria-label="Sort Icon"></i>
                    </th>
                </tr>
            </thead>
            <tbody v-if="table.sortedList.length > 0">
                <tr v-for="item in table.sortedList" :key='item' class="small text-start" @dblclick="tableRowDoubleClick(item.dataEntity)">
                    <td>
                        <FormCheckbox v-model="item.selected" />
                    </td>
                    <td v-for="[field, f] in table.fields" :key='field'>
                        <span :class="f.class + (f.classes ? ' ' + f.classes.get(item[field]) : '')">{{ item[field] }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- <div v-for="item in table.sortedList" :key="item">
        {{item.selected}}
    </div> -->

    <div>
        <PaginationComponent :pagination="pagination" :getPage="getPage" />
    </div>

    <Teleport to="body">
        <ModalComponent :show="showModal" @close="showModal = false">
            <template #header>
                <h3>{{ modalHeader }}</h3>
            </template>
            <template #body>
                {{ modalBody }}
            </template>
            <template #footer>
                <button type="button" class="btn btn-primary" @click="handleSelectedItems">OK</button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button type="button" class="btn btn-primary" @click="showModal = false">Cancel</button>
            </template>
        </ModalComponent>
    </Teleport>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import PaginationComponent from '@/components/PaginationComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import FormCheckbox from './FormCheckbox.vue';

export default {

    components: {
        PaginationComponent,
        ModalComponent,
        FormCheckbox
    },

    props: {
        title: String,
        pageSize: Number,
        tableFields: Object,
        getPageUrl: String,
        pageHandler: Function,
        actions: Object
    },

    setup(props) {

        const store = useStore();

        const pagination = reactive({
            currentPage: 1,
            pageSize: props.pageSize,
            total: null
        });

        let bulkActions = new Map();
        let actions = new Map();
        props.actions.forEach(
            (value, key) => {
                if (key.startsWith('_')) {
                    actions.set(key, value);
                } else {
                    bulkActions.set(key, value);
                }
            }
        );
        const tableRowDoubleClick = actions.get('_tableRowDoubleClick').action;

        const table = reactive({
            title: props.title,
            fields: props.tableFields,
            iconClass: "",
            sortedBy: "",
            sortOrder: "asc",
            sortedList: [],
            getPageUrl: props.getPageUrl,
            bulkActions: bulkActions,
            actions: actions
        });

        function getCurrentPage() {
            getPage(pagination.currentPage);
            table.sortedBy = '';
            table.sortOrder = 'desc';
            sortTable('created');
        }

        function getPage(newpage) {
            const accessToken = store.getters['auth/accessToken'];

            fetch(table.getPageUrl + `?page=${newpage}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                table.sortedList = props.pageHandler(data);
                pagination.total = parseInt(data.total);
                pagination.currentPage = newpage;
                pagination.pageSize = data.pageSize;
            });
        }

        function sortTable(sortBy) {
            if (sortBy === table.sortedBy && table.sortOrder === "asc") {
                table.sortOrder = "desc";
            }
            else if (sortBy === table.sortedBy && table.sortOrder === "desc") {
                table.sortOrder = "asc";
            }
            if (table.sortOrder === "asc") {
                table.iconClass = "bi bi-sort-alpha-down";
            } else {
                table.iconClass = "bi bi-sort-alpha-up";
            }
            orderBy(table.sortedList, sortBy, table.sortOrder);
            table.sortedBy = sortBy;
        }

        function orderBy(items, field, order) {
            items.sort(
                function (first, second) {
                    if (first[field] > second[field]) {
                        if (order === 'asc') {
                            return 1;
                        }
                        return -1;
                    }
                    if (first[field] < second[field]) {
                        if (order === 'asc') {
                            return -1;
                        }
                        return 1;
                    }
                    return 0;
                }
            );
        }

        function selectAll(event) {
            const isChecked = event.target.checked;
            setSelectedForAllItems(isChecked);
        }

        let showModal = ref(false);
        let handleSelectedItems = ref(null);
        let modalHeader = ref(null);
        let modalBody = ref(null);

        function bulkActionSelected(event) {
            const action = event.target.value;
            event.target.value = '';
            let actionObject = table.bulkActions.get(action);
            let actionFunction = actionObject.action;
            let selectedRows = [];
            table.sortedList.forEach(
                (item) => {
                    if (item.selected) {
                        selectedRows.push(item.dataEntity);
                    }
                }
            );

            if (actionObject.confirmation) {
                modalHeader.value = actionObject.modalHeader;
                if (actionObject.modalBody) {
                    modalBody.value = actionObject.modalBody;
                } else {
                    modalBody.value = selectedRows.toString();
                }
                handleSelectedItems.value = function () {
                    showModal.value = false;
                    actionFunction(selectedRows);
                    //setSelectedForAllItems(false);
                }
                showModal.value = true;
            } else {
                actionFunction(selectedRows);
            }
        }

        function setSelectedForAllItems(selected) {
            table.sortedList.forEach(
                (item) => {
                    item.selected = selected;
                }
            );
        }

        onMounted(
            () => {
                getCurrentPage();
            }
        );

        return {
            table,
            store,
            sortTable,
            selectAll,
            bulkActionSelected,
            showModal,
            handleSelectedItems,
            modalHeader,
            modalBody,
            getCurrentPage,
            getPage,
            pagination,

            tableRowDoubleClick
        }
    }
}
</script>
