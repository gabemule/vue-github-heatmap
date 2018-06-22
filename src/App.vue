<template>
    <div id="app">

        <!-- MINIMAL USAGE -->
        <GitHubHeatMap
            :days="days"
        ></GitHubHeatMap>

        <br> <br> <br> <br>

        <!-- USAGE W/ CONFIGURATIONS -->
        <GitHubHeatMap
            :days="days"
            :colors="['#EEFF07', '#FFC706', '#FF8F05', '#FF4F04', '#FF0004']"
            :styling="{ width: 15, height: 15, margin: 1 }"
            :locale="{
                months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                days: ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'],
                no: 'Não há',
                commit: 'contribuições',
                on: 'em',
            }"
        ></GitHubHeatMap>

    </div>
</template>

<script>
    import GitHubHeatMap from './components/GitHubHeatMap.vue';
    import serviceDays from './services/days';

    export default {
        name: 'app',
        components: {
            GitHubHeatMap
        },
        data() {
            return {
                days: [],
            }
        },
        methods: {
            getDays() {
                serviceDays.getDays().then(
                    success => {
                        this.days = success.data;
                    },
                    error => {
                        console.error('error ', error);
                    }
                )
            }
        },
        mounted() {
            this.getDays();
        }
    }
</script>

<style lang="scss">
    @import './assets/tooltip';

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        margin: 50px 0;
    }
</style>
