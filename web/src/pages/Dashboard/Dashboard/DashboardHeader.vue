<template>
    <div class="panel-header panel-header-lg">
        <header-chart
                v-if="loaded"
                :height="255"
                :dataOrganic="chartDataOrganic"
                :dataRecommended="chartDataRecommended"
                :dataSearch="chartDataSearch"
                :dataOverlay="chartDataOverlay"
                :labels="chartLabels">
        </header-chart>
    </div>
</template>

<script>
    import HeaderChart from './HeaderChart';

    export default {
        name: 'overview-header',
        components: {
            HeaderChart
        },
        data: () => ({
            loaded: false,
            chartDataOrganic: null,
            chartDataRecommended: null,
            chartDataSearch: null,
            chartDataOverlay: null,
            chartLabels: []
        }),
        mounted() {
            this.loaded = false;
        }
    };
</script>

<style scoped>
</style>
