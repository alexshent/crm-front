<template>
    <div class="container">
        <form @submit.prevent="onSubmit">

            <div class="row">
                <div class="col-6">
                    <div class="mb-3">
                        <FormInput label="First Name" type="text" v-model.lazy.trim="employee_.firstName" />
                    </div>

                    <div class="mb-3">
                        <FormInput label="Last Name" type="text" v-model.lazy.trim="employee_.lastName" />
                    </div>

                    <div class="mb-3">
                        <FormInput label="Job Title" type="text" v-model.lazy.trim="employee_.jobTitle" />
                    </div>

                    <div class="mb-3">
                        <FormSelect label="Department" v-model.lazy="employee_.department.id" :options="departments" />
                    </div>

                    <div class="mb-3">
                        <fieldset>
                            <legend>Primary Address</legend>
                            <FormInput label="Country" type="text" v-model.lazy.trim="employee_.primaryAddress.country" />
                            <FormInput label="State" type="text" v-model.lazy.trim="employee_.primaryAddress.state" />
                            <FormInput label="City" type="text" v-model.lazy.trim="employee_.primaryAddress.city" />
                            <FormInput label="Street" type="text" v-model.lazy.trim="employee_.primaryAddress.street" />
                            <FormInput label="Postal Code" type="text" v-model.lazy.trim="employee_.primaryAddress.postalCode" />
                        </fieldset>
                    </div>

                </div>

                <div class="col-6">

                    <div class="mb-3">
                        <FormInput label="Office Phone" type="tel" v-model.lazy.trim="employee_.officePhone.number" />
                    </div>

                    <div class="mb-3">
                        <FormInput label="Mobile Phone" type="tel" v-model.lazy.trim="employee_.mobilePhone.number" />
                    </div>

                    <div class="mb-3">
                        <FormInput label="Primary Email" type="email" v-model.lazy.trim="employee_.primaryEmail.email" />
                    </div>

                    <div class="mb-3">
                        <FormSelect label="Status" v-model.lazy="employee_.status.id" :options="employeeStatuses" />
                    </div>

                </div>
            </div>

            <div class="row">
                <div class="col-12">

                    <div class="mb-3">
                        <label for="notes" class="form-label float-start">Notes</label>
                        <textarea id="notes" class="form-control" v-model.lazy.trim="employee_.notes"></textarea>
                    </div>

                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { reactive } from 'vue';
import { useStore } from 'vuex';
import FormInput from './FormInput.vue';
import FormSelect from './FormSelect.vue';

export default {
    props: {
        employee: Object
    },

    setup(props) {
        const store = useStore();
        const departments = store.getters['enum/department'];
        const employeeStatuses = store.getters['enum/employeeStatus'];

        let employee_ = reactive(props.employee);

        if (!('id' in employee_.department)) {
            const firstDepartmentId = departments[0].id;
            employee_.department.id = firstDepartmentId;
        }

        if (!('id' in employee_.status)) {
            const firstEmployeeStatusId = employeeStatuses[0].id;
            employee_.status.id = firstEmployeeStatusId;
        }

        if (!('primaryAddress' in employee_) || employee_.primaryAddress == null) {
            employee_.primaryAddress = {};
        }
        if (!('officePhone' in employee_) || employee_.officePhone == null) {
            employee_.officePhone = {};
        }
        if (!('mobilePhone' in employee_) || employee_.mobilePhone == null) {
            employee_.mobilePhone = {};
        }
        if (!('primaryEmail' in employee_) || employee_.primaryEmail == null) {
            employee_.primaryEmail = {};
        }

        return {
            employee_,
            departments,
            employeeStatuses
        };
    },
    components: { FormInput, FormSelect }
}
</script>