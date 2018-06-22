<template>
    <div id="app">
        <GitHubHeatMap
            :days="days"
        ></GitHubHeatMap>

        <br>

        <!--<GitHubHeatMap-->
            <!--:days="days"-->
            <!--:colors="['#eee', '#c6e48b', '#7bc96f', '#239a3b', '#196127']"-->
            <!--:styling="{ width: '20', height: '20', margin: '1' }"-->
        <!--&gt;</GitHubHeatMap>-->

        <!--
        <GitHubHeatMap
            :days="days"
            :colors="['#eee', '#c6e48b', '#7bc96f', '#239a3b', '#196127']"
            :styling="{ width: '20px', height: '20px', margin: '2.5' }"
        ></GitHubHeatMap>
        -->
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
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
