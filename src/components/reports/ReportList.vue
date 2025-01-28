<template>
    <div class="reports">
        <div class="report__title">
            <h2>
                Generador de reportes TK
            </h2>
        </div>
        <div class="report__table">
            <table>
                <thead>
                    <tr>
                        <th>
                            <p>Titulo</p>
                        </th>
                        <th>
                            <p>Fecha de creación</p>
                        </th>
                        <th>
                            <p>Acción</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="report in reports" :key="report.id">
                        <th>
                            <p>{{ report.attributes.title }}</p>
                        </th>
                        <th>
                            <p>{{ report.attributes.created_at }}</p>
                        </th>
                        <th>
                            <span @click="downloadReport(report.id)">Descargar <i class='bx bxs-download'></i></span>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="report__button">
        <button @click="openDialog">
            Crear Reporte
        </button>
    </div>

    <ReportDialog ref="dialogRef" @report-created="fetchReports" />

</template>
<script setup>
import ReportDialog from './ReportDialog.vue'
import tkambioApi from '../../api/tkambioApi'
import { getAuthHeaders } from '../../utils/getAuthHeaders'
import { ref, onMounted } from 'vue'
const loading = ref(true)
const dialogRef = ref()
const reports = ref([])
const openDialog = () => {
    dialogRef.value?.openDialog()
}
const fetchReports = async () => {
    try {
        const response = await tkambioApi.get('/list-reports', getAuthHeaders())
        reports.value = response.data.data
    } catch (error) {
        console.error('Error al obtener los reportes:', error)
    } finally {
        loading.value = false
    }
}
const downloadReport = async (id) => {
    try {
        const response = await tkambioApi.get(`/get-report/${id}`, {
            headers: getAuthHeaders().headers, 
            responseType: 'blob'
        });


        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `reporte-${id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error al descargar el reporte:', error);
    }
};
onMounted(fetchReports)
</script>
<style lang="scss">
@use './Report.scss';
</style>