export default {

    getAll(context) {
        const server = process.env.VUE_APP_BACKEND_SERVER;
        const url = `${server}/api/enumeration`;
        const accessToken = context.rootGetters['auth/accessToken'];

        fetch(url, {
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
            context.commit('setEnums', {
                department: data.departments,
                employeeStatus: data.employeeStatuses
            });
        });
    }
};