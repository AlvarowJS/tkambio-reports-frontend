<template>
    <div class="login">
        <div class="login__card">
            <h3>Login</h3>
            <div class="login__card-container">
                <label for="user">Ingrese su usuario</label>
                <input v-model="data.email" type="text" id="user" required />
            </div>

            <div class="login__card-container">
                <label for="password">Ingrese su contraseña</label>
                <input v-model="data.password" type="password" id="password" required />
            </div>
            <button @click="login">
                Ingresar
            </button>
            <p v-if="errorMessage" class="login__card-error">{{ errorMessage }}</p>
            <div class="login__card-credentials">
                <p>Usuario Test:</p>
                <p>jalvarojs123@hotmail.com</p>

                <p>Password Test:</p>
                <p>Alva100@ing</p>

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import tkambioApi from '../../api/tkambioApi'

const router = useRouter()
const errorMessage = ref('')
const data = ref({
    title: '',
    startDate: '',
    endDate: ''
})

const login = async () => {
    errorMessage.value = ''
    try {
        const response = await tkambioApi.post('/login', data.value)
        localStorage.setItem('token', response.data.token)
        router.push('/report')
    } catch (error) {
        console.error('Error al generar el reporte:', error)    
        errorMessage.value = 'Credenciales incorrectas. Intente nuevamente.'
    
    }
}
</script>

<style lang="scss" scoped>
@import './LoginView.scss';
</style>