<template>
    <div class="github-heatmap" v-if="days.length">

        <ul class="day-wrap" :style=" { height: wrapHeight, width: wrapWidth } ">

            <!-- NULL BLOCKS STARTING SUNDAY -->
            <li class="day-block"
                 v-for="item in nullDates"
                 :style="{
                    width: blockWidth,
                    height: blockHeight,
                    margin: blockMargin
                 }">
            </li>

            <!-- ITERATE BLOCKS IN ARRAY -->
            <li class="day-block"
                v-for="item in days"
                :style="{
                    backgroundColor: returnColor(item.count),
                    width: blockWidth,
                    height: blockHeight,
                    margin: blockMargin
                }">
                 <span class="day-tooltip"> {{ item.count ? item.count : locale.no }} {{ locale.commit }} {{ locale.on }} {{ item.date }} </span>
            </li>

        </ul>

    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        name: 'GitHubHeatMap',
        data() {
            return {
                maxCount: 0,
            }
        },
        props: {
            days: {
                required: true,
                type: Array
            },
            colors: {
                type: Array,
                default() { return ['#eee', '#c6e48b', '#7bc96f', '#239a3b', '#196127'] },
            },
            locale: {
                type: Object,
                default() {
                    return {
                        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                        no: 'No',
                        on: 'on',
                        commit: 'contributions'
                    }
                }
            },
            styling: {
                type: Object,
                default() {
                    return {
                        width: '10',
                        height: '10',
                        margin: '2.5'
                    }
                }
            }
        },
        computed: {
            nullDates() {
                if (this.days.length) {
                    let firstDay =  moment(this.days[0].date);
                    let firstWeekDay = moment(firstDay).startOf('week');
                    return firstDay.diff(firstWeekDay, 'days');
                } else {
                    return 0;
                }
            },

            wrapWidth() {
                let columns = Math.ceil((this.days.length + this.nullDates) / this.locale.days.length);
                let columnWidth = parseFloat(this.styling.width) + parseFloat(this.styling.margin * 2);

                return (columnWidth * columns) + 'px'
            },
            wrapHeight() {
                return (parseFloat(this.styling.height) * this.locale.days.length) + (parseFloat(this.styling.margin) * (this.locale.days.length * 2)) + 'px'
            },

            blockWidth() {
                return this.styling.width + 'px'
            },
            blockHeight() {
                return this.styling.height + 'px'
            },
            blockMargin() {
                return this.styling.margin + 'px'
            }
        },
        methods: {
            returnColor(count) {
                if (count) {
                    let range = parseInt(count / (this.maxCount / this.colors.length));
                    return this.colors[range === this.colors.length ? this.colors.length - 1 : range];
                } else {
                    return false;
                }
            },
        },
        watch: {
            days() {
                this.days.forEach((item) => {
                    if (item.count > this.maxCount) {
                        this.maxCount = item.count;
                    }
                });
            }
        },
    }
</script>

<style scoped lang="scss">
    .github-heatmap {
        display: inline-flex;

        .day-wrap {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            margin: 0;
            padding: 0;

            .day-block {
                list-style: none;
                position: relative;

                &:hover {
                    .day-tooltip {
                        display: block;
                        position: absolute;
                        z-index: 99;
                    }
                }

                .day-tooltip {
                    display: none;
                }
            }
        }
    }
</style>
