<template>
    <div class="overlay" v-if="isVisible" @click="closeDialog"></div>

    <dialog ref="dialogRef" v-show="isVisible" @click="handleOverlayClick">
        <form method="dialog" class="report__form">
            <h3>Reporte por fecha de nacimiento</h3>
            <h4>Ingresa los siguientes datos para generar tu reporte</h4>

            <div class="report__input-container">
                <label for="title">Descripción del reporte</label>
                <input v-model="reportData.title" type="text" id="input" required />
            </div>
            <p>Fecha de nacimiento</p>
            <div class="report__form-inputs">
                
                <div class="report__input-container">
                    <label for="startDate">Inicio</label>
                    <input v-model="reportData.startDate" type="date" id="startDate" required />
                </div>

                <div class="report__input-container">
                    <label for="endDate">Fin</label>
                    <input v-model="reportData.endDate" type="date" id="endDate" required />
                </div>
            </div>
            <button :disabled="!isFormValid" :class="report__button" @click="generateReport">Generar Reporte</button>
        </form>
    </dialog>
</template>
<script setup>
import { ref, defineEmits, computed } from 'vue'
import { getAuthHeaders } from '../../utils/getAuthHeaders'
const dialogRef = ref()
const isVisible = ref(false)
const successMessage = ref(null)
const errorMessage = ref(null)
const loading = ref(true)
import tkambioApi from '../../api/tkambioApi'
const openDialog = () => {
    isVisible.value = true
    dialogRef.value?.showModal()
}
const closeDialog = () => {
    isVisible.value = false
    dialogRef.value?.close()
}
const handleOverlayClick = (event) => {
    if (event.target === dialogRef.value) {
        closeDialog()
    }
}
const emit = defineEmits(['report-created'])

const reportData = ref({
    title: '',
    startDate: '',
    endDate: ''
})
const resetForm = () => {
    reportData.value = {
        title: '',
        startDate: '',
        endDate: ''
    }
}
const report__button = computed(() => {
    return {
        'button-disabled': !isFormValid.value,
        'button-enabled': isFormValid.value,
    }
})
const isFormValid = computed(() => {
    return reportData.value.title && reportData.value.startDate && reportData.value.endDate
})
const generateReport = async () => {
    loading.value = true
    successMessage.value = null
    errorMessage.value = null

    try {
        const response = await tkambioApi.post('/generate-report', reportData.value,getAuthHeaders())
        successMessage.value = 'Reporte generado correctamente'
        emit('report-created')
        resetForm()
        closeDialog()

    } catch (error) {
        console.error('Error al generar el reporte:', error)
        errorMessage.value = 'Error al generar el reporte'
    } finally {
        loading.value = false
    }
}
defineExpose({
    openDialog,
    closeDialog
})
</script>
<style lang="scss" scoped>
@use './Report.scss';
</style>