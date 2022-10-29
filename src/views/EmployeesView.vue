<template>
    <div class="row">
        <div class="col-11">
        </div>
        <div class="col-1">
            <button type="button" class="btn btn-primary" @click="onCreateNewClick">+</button>
        </div>
    </div>

    <ModalComponent :show="!!error" @close="error = null">
        <template #header>
            <h3>Error</h3>
        </template>
        <template #body>
            {{ error }}
        </template>
        <template #footer>&nbsp;</template>
    </ModalComponent>

    <ModalComponent :show="showModalEdit" @close="showModalEdit = false">
        <template #header>
            <h3>Add new employee</h3>
        </template>
        <template #body>
            <EmployeeEditForm :employee="editableEntity" />
        </template>
        <template #footer>
            <button type="button" class="btn btn-primary" @click="onSaveEditableClick">Save</button>
        </template>
    </ModalComponent>

    <TableComponent ref="tableComponentRef" :title="'Employees'" :tableFields="fields"
        :getPageUrl="getPageUrl" :pageHandler="pageHandler" :actions="actions" />

</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import TableComponent from '@/components/TableComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import EmployeeEditForm from '@/components/EmployeeEditForm.vue';

export default {

    components: {
        TableComponent,
        ModalComponent,
        EmployeeEditForm,
    },

    setup() {
        let error = ref(null);
        const store = useStore();
        const server = process.env.VUE_APP_BACKEND_SERVER;
        const tableComponentRef = ref(null);
        const getPageUrl = `${server}/api/employee`;

        const fields = new Map();
        fields.set('name', {
            label: 'Name',
            class: ''
        });
        fields.set('jobTitle', {
            label: 'Job Title',
            class: ''
        });
        fields.set('department', {
            label: 'Department',
            class: 'text-nowrap'
        });
        fields.set('officePhone', {
            label: 'Office Phone',
            class: 'font-monospace'
        });
        fields.set('mobilePhone', {
            label: 'Mobile Phone',
            class: 'font-monospace'
        });
        fields.set('primaryEmail', {
            label: 'Primary Email',
            class: 'font-monospace'
        });
        fields.set('alternateEmails', {
            label: 'Alternate Emails',
            class: 'font-monospace'
        });
        fields.set('primaryAddress', {
            label: 'Primary Address',
            class: ''
        });
        fields.set('notes', {
            label: 'Notes',
            class: ''
        });
        fields.set('reportsTo', {
            label: 'Reports To',
            class: ''
        });
        fields.set('status', {
            label: 'Status',
            class: '',
            classes: new Map([
                ['Active', 'badge text-bg-success'],
                ['On Leave', 'badge text-bg-warning'],
                ['Dismissed', 'badge text-bg-secondary'],
            ])
        });
        fields.set('created', {
            label: 'Created',
            class: ''
        });

        const actions = new Map([
            ['hello', {
                action: function (employees) {
                    console.log('hello');
                    console.log(employees);
                },
                confirmation: true,
                modalHeader: 'Hello?',
                modalBody: null
            }],
            ['delete', {
                action: actionDelete,
                confirmation: true,
                modalHeader: 'Delete employees?',
                modalBody: null
            }],
            ['_tableRowDoubleClick', {
                action: onTableRowDoubleClick
            }]
        ]);

        function pageHandler(data) {
            let tableEntities = [];
            let tableEntity;

            data.entities.forEach(
                entity => {
                    let alternateEmails = '';
                    entity.alternateEmails.forEach(
                        ae => {
                            alternateEmails += `${ae.email}\n`;
                        }
                    );

                    let primaryAddress = null;
                    if (entity.primaryAddress) {
                        primaryAddress =
                        `${entity.primaryAddress.postalCode}, ` +
                        `${entity.primaryAddress.street}, ` +
                        `${entity.primaryAddress.city}, ` +
                        `${entity.primaryAddress.state}, ` +
                        `${entity.primaryAddress.country}`;
                    }

                    let officePhone = null;
                    if (entity.officePhone) {
                        officePhone = entity.officePhone.number;
                    }

                    let mobilePhone = null;
                    if (entity.mobilePhone) {
                        mobilePhone = entity.mobilePhone.number;
                    }

                    let primaryEmail = null;
                    if (entity.primaryEmail) {
                        primaryEmail = entity.primaryEmail.email;
                    }

                    let reportsTo = null;
                    if (entity.reportsTo) {
                        reportsTo = entity.reportsTo.fullName;
                    }

                    let created = entity.created.substring(0, entity.created.length - 6);
                    created = created.replace('T', "\n");

                    entity.toString = function() {
                        return this.fullName;
                    };

                    tableEntity = {
                        dataEntity: entity,
                        selected: false,
                        name: entity.fullName,
                        jobTitle: entity.jobTitle,
                        department: entity.department.name,
                        officePhone: officePhone,
                        mobilePhone: mobilePhone,
                        primaryEmail: primaryEmail,
                        alternateEmails: alternateEmails,
                        primaryAddress: primaryAddress,
                        notes: entity.notes,
                        reportsTo: reportsTo,
                        status: entity.status.name,
                        created: created
                    };

                    tableEntities.push(tableEntity);

                });

                return tableEntities;
        }

        // -------------------------------------

        async function createEntity(entity) {

            if (entity.officePhone.number == null) {
                delete entity.officePhone;
            }
            if (entity.mobilePhone.number == null) {
                delete entity.mobilePhone;
            }
            if (entity.primaryEmail.email == null) {
                delete entity.primaryEmail;
            }
            if (entity.notes == null) {
                delete entity.notes;
            }

            const accessToken = store.getters['auth/accessToken'];

            let response = await fetch(`${server}/api/employee`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entity)
            });

            if (response.ok) {
                reloadTable();
            } else {
                if (response.status === 403) {
                    throw new Error('Insufficient privilege level for creating new employees!');
                }
            }
        }

        // -------------------------------------

        async function updateEntity(entity)  {

            const accessToken = store.getters['auth/accessToken'];

            let response = await fetch(`${server}/api/employee`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entity)
            });

            if (response.ok) {
                reloadTable();
            } else {
                if (response.status === 403) {
                    throw new Error('Insufficient privilege level for updating employees!');
                }
            }
        }

        // -------------------------------------

        async function actionDelete(employees) {
            
            let list = [];
            employees.forEach(employee => {
                list.push(employee.id);
            });

            const accessToken = store.getters['auth/accessToken'];

            try {
                let response = await fetch(`${server}/api/employee`, {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(list)
                });

                if (response.ok) {
                    reloadTable();
                } else {
                    if (response.status === 403) {
                        throw new Error('Insufficient privilege level for deleting employees!');
                    }
                }
            } catch (e) {
                error.value = e.message;
            }
        }

        // -------------------------------------

        let showModalEdit = ref(false);
        let editableEntity = ref(null);

        function onCreateNewClick() {
            
            editableEntity.value = {
                department: {},
                status: {},
                officePhone: {},
                mobilePhone: {},
                primaryEmail: {},
                primaryAddress: {}
            };

            showModalEdit.value = true;
        }

        async function onSaveEditableClick() {
            showModalEdit.value = false;

            try {
                if ('id' in editableEntity.value) {
                    // update
                    await updateEntity(editableEntity.value);
                } else {
                    // create
                    await createEntity(editableEntity.value);
                }                
            } catch (e) {
                error.value = e.message;
            }
        }

        function onTableRowDoubleClick(entity) {
            editableEntity.value = entity;
            showModalEdit.value = true;
        }

        function reloadTable() {
            tableComponentRef.value.getCurrentPage();
        }

        // -------------------------------------

        return {
            error,
            store,
            tableComponentRef,
            getPageUrl,
            pageHandler,
            fields,
            actions,
            showModalEdit,
            editableEntity,
            onCreateNewClick,
            onSaveEditableClick
        }
    }
}
</script>
