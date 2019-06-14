var ONEDAY = 86400000;
var myChart = echarts.init(document.getElementById('main-chart'));
var button = document.getElementById("button-go");
var profitCount = [];
var startDay;
var buttonZoom = document.getElementById("button-range-zoom");
function momentFormat(data) {
    return moment(data).format("ll");
};
button.onclick = function() {
    class WithdrawalTimer {
        constructor(timer, withdrawal) {
            this.timer = timer;
            this.withdrawal = withdrawal;
        }
    }
    var dayCount = {
        num: [],
        str: [],
        profit: []
    }
    var creditLimit = +document.getElementById("credit-limit").value;
    var oneTimeWithdrawal = +document.getElementById("one-time-withdrawal").value;
    var daysWithoutPercents = +document.getElementById("days-without-percents").value;
    var annualMaintenance = +document.getElementById("annual-maintenance").value;
    var debetPercent = +document.getElementById("debet-percent").value / 36500;
    var days = +document.getElementById("days-range").value;
    var dayStart = moment(document.getElementById("day-start").value);
    startDay = new Date(document.getElementById("day-start").value).valueOf();
    if (dayStart._isValid == false) {
        document.getElementById('day-start').value = moment().format("YYYY-MM-DD");
        dayStart = moment();
    }
    var debetBalance = 0;
    var withdrawalTimers = new WithdrawalTimer;
    withdrawalTimers = [];
    dayCount.num.push(0);
    dayCount.str.push(dayStart.format('YYYY-MM-DD'));
    dayCount.profit.push(-annualMaintenance);
    // dayCount[0].profit = -annualMaintenance;
    // dayCount[0].str = dayStart.format('YYYY-MM-DD');
    // dayCount[0].num = 0;
    var creditTimer = 0;
    var profitDay = -2;
    var profitDayProfit = 0;
    let bool = true;
    for(var day = 0; day < days; day++) {
        if (creditTimer == 0) {
            switch (true) {
                case creditLimit<=oneTimeWithdrawal && creditLimit!=0:
                    debetBalance += creditLimit;
                    withdrawalTimers.push({timer: daysWithoutPercents, withdrawal: creditLimit});
                    creditLimit = 0;
                    creditTimer = 30;
                    break;
                case creditLimit>oneTimeWithdrawal:
                    debetBalance += oneTimeWithdrawal;
                    withdrawalTimers.push({timer: daysWithoutPercents, withdrawal: oneTimeWithdrawal});
                    creditLimit = creditLimit - oneTimeWithdrawal;
                    creditTimer = 30;
                    break;
                case creditLimit==0:
                    creditTimer++;
                    break;
            };
        };
        if (withdrawalTimers[0].timer == 0) {
            creditLimit += withdrawalTimers[0].withdrawal;
            debetBalance -= withdrawalTimers[0].withdrawal;
            withdrawalTimers.shift({});
        };
        dayCount.num.push(day + 1);
        dayCount.str.push(moment(dayCount.str[day]).add(1, 'd').format("YYYY-MM-DD"));
        dayCount.profit.push(Math.round((dayCount.profit[day] + debetBalance * debetPercent) * 100) / 100);
        for (var i = 0; i < withdrawalTimers.length; i++) {
            withdrawalTimers[i].timer--;
        };
        creditTimer--;
        if (dayCount.profit[day+1]>0 && bool) {
            profitDay = day+1;
            profitDayProfit = dayCount.profit[day+1];
            bool = false;
        };
        if (day%365==0 && day!=0) {
            dayCount.profit[day+1] -= annualMaintenance;
        };
    }
    option = {
        title: {
            text: 'График прибыли'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                label: {
                    formatter: function (params) {
                        return momentFormat(dayCount.str[params.value]);
                    }
                }
            }
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    title: {
                        zoom: 'Приблизить'
                    },
                    yAxisIndex: 'none'
                },
                restore: {
                    title: 'Восстановить масштаб'
                },
                saveAsImage: {
                    title: 'Сохранить как картинку'
                }
            }
        },
        dataZoom: [{
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter'
        }],
        xAxis: {
            type: 'category',
            data: dayCount.num,
            axisLabel: {
                formatter: function (value, index) {
                    var label = momentFormat(dayCount.str[value]);
                    return label;
                }
            }
        },
        yAxis: {
            type: 'value',
        },
        series: [{
            name: 'доход',
            type: 'line',
            data: dayCount.profit,
            smooth: true,
            markPoint: {
                data: [
                    {name: 'бинго!', value: 'бинго!', yAxis: profitDayProfit, xAxis: profitDay}
                ]
            }
        }]
    };
    myChart.setOption(option);
    document.getElementById("day-profit").value = profitDay;
    document.getElementById("profit").value = dayCount.profit[days];
    buttonZoom.removeAttribute("disabled");
}
console.log(buttonZoom);
buttonZoom.onclick = function () {
    var dateStart, dateEnd;
    dateStart = new Date(document.getElementById("days-range-start").value).valueOf();
    dateEnd = new Date(document.getElementById("days-range-end").value).valueOf();
    console.log(document.getElementById("days-range-start").value);
    let bool = document.getElementById("days-range-start").value!=""&&document.getElementById("days-range-end").value!="";
    switch (true) {
        case dateStart<startDay||dateEnd>(startDay + document.getElementById("days-range").value * ONEDAY):
            alert("Одна из дат вне диапазона");
            break;
        case bool&&dateStart<=dateEnd:
            myChart.dispatchAction({
                type: 'dataZoom',
                startValue: (dateStart - startDay) / ONEDAY,
                endValue: (dateEnd - startDay) / ONEDAY
            });
            break;
        case bool&&dateStart>dateEnd:
            myChart.dispatchAction({
                type: 'dataZoom',
                startValue: (dateEnd - startDay) / ONEDAY,
                endValue: (dateStart - startDay) / ONEDAY
            });
            break;
        default:
            alert("Одна из дат не введена или введена неправильно!");
            break;
    };
}