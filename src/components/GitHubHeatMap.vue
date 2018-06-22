<template>
    <div class="github-heatmap" v-if="days.length">

        <div class="header-wrap">
            <ul :style=" { width: wrapWidth } ">
                <li
                    v-for="item in monthCount"
                    :style="{ width: monthWidth(item) }"
                > {{ localization.months[formatMonth(item)] }} </li>
            </ul>
        </div>

        <div class="row-wrap">
            <div class="week-wrap">
                <ul>
                    <li v-for="item in localization.days"
                        :style="{ height: blockHeight, margin: blockMargin }"
                    > {{ item }} </li>
                </ul>
            </div>

            <ul class="day-wrap" :style=" { height: wrapHeight, width: wrapWidth } ">
                <!-- NULL BLOCKS STARTING SUNDAY -->
                <li class="day-block"
                    v-for="item in nullDates"
                    :style="{ width: blockWidth, height: blockHeight, margin: blockMargin }"
                ></li>
                <!-- ITERATE BLOCKS IN ARRAY -->
                <li class="day-block"
                    v-for="item in days"
                    :style="{ backgroundColor: returnColor(item.count), width: blockWidth, height: blockHeight, margin: blockMargin }"
                    v-tooltip="(item.count ? item.count : localization.no) + ' ' + localization.commit + ' ' + localization.on + ' ' + formatDate(item.date)"
                ></li>
            </ul>
        </div>

    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        name: 'GitHubHeatMap',
        data() {
            return {
                maxCount: 0,
                monthCount: [],
                style: { width: 14, height: 14, margin: 1 },
                localization: {
                    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    days: ['', 'Mon', '', 'Wed', '', 'Fri', ''],
                    no: 'No',
                    on: 'on',
                    commit: 'contributions',
                },
            }
        },
        props: {
            days: { required: true, type: Array },
            colors: {
                type: Array,
                default() { return ['#eee', '#c6e48b', '#7bc96f', '#239a3b', '#196127'] },
            },
            locale: { type: Object },
            styling: { type: Object },
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
            columnFullWidth() {
                return parseFloat(this.style.width) + parseFloat(this.style.margin * 2)
            },
            wrapWidth() {
                let columns = Math.ceil((this.days.length + this.nullDates) / this.localization.days.length);
                return (this.columnFullWidth * columns) + 'px'
            },
            wrapHeight() {
                return (parseFloat(this.style.height) * this.localization.days.length) + (parseFloat(this.style.margin) * (this.localization.days.length * 2)) + 'px'
            },
            blockWidth() {
                return this.style.width + 'px'
            },
            blockHeight() {
                return this.style.height + 'px'
            },
            blockMargin() {
                return this.style.margin + 'px'
            },
        },
        methods: {
            // helpers
            returnColor(count) {
                if (count) {
                    let range = parseInt(count / (this.maxCount / this.colors.length));
                    return this.colors[range === this.colors.length ? this.colors.length - 1 : range];
                } else {
                    return false;
                }
            },
            formatDate(payload) {
                return moment(new Date(payload)).format('ll');
            },
            formatMonth(item) {
                return moment(item).get('month');
            },
            monthWidth(item) {
                let a = 0;
                this.days.forEach((day) => {
                    if (moment(day.date).get('month') === moment(item).get('month') && moment(day.date).get('month') === moment(item).get('month')) { a++ }
                });
                let columns = Math.ceil(a / this.localization.days.length);
                return Math.ceil( columns * this.columnFullWidth ) + 'px';
            },
            // set props as data
            setStyles() {
                if (this.styling.width) { this.style.width = this.styling.width }
                if (this.styling.height) { this.style.height = this.styling.height }
                if (this.styling.margin) { this.style.margin = this.styling.margin }
            },
            setLocale() {
                if (this.locale.months) { this.localization.months = this.locale.months }
                if (this.locale.days) { this.localization.days = this.locale.days }
                if (this.locale.no) { this.localization.no = this.locale.no }
                if (this.locale.on) { this.localization.on = this.locale.on }
                if (this.locale.commit) { this.localization.commit = this.locale.commit }
            },
        },
        watch: {
            days() {
                this.days.forEach((item) => {
                    if (item.count > this.maxCount) { this.maxCount = item.count }

                    let month = moment(item.date).format('YYYY-MM');
                    if (!this.monthCount.includes(month)) { this.monthCount.push(month) }
                });
            }
        },
        created() {
            if (this.styling) { this.setStyles() }
            if (this.locale) { this.setLocale() }
        }
    }
</script>

<style scoped lang="scss">
    .github-heatmap {
        display: inline-flex;
        flex-direction: column;

        .header-wrap {
            display: flex;
            flex-direction: row;
            margin-bottom: 5px;
            justify-content: flex-end;

            ul {
                display: flex;
                flex-direction: row;
                margin: 0;
                padding: 0;

                li {
                    list-style: none;
                    font-size: 10px;
                }
            }
        }

        .row-wrap {
            display: flex;
            flex-direction: row;

            .week-wrap {
                ul {
                    display: flex;
                    flex-direction: column;
                    margin: 0 10px 0 0;
                    padding: 0;
                    li {
                        list-style: none;
                        font-size: 10px;

                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        text-align: center;
                    }
                }
            }

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
    }
</style>
