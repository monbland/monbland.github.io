var button = document.getElementById("button-go");
button.onclick = function() {
    class WithdrawalTimer {
        constructor(timer, withdrawal) {
            this.timer = timer;
            this.withdrawal = withdrawal;
        }
    }
    var creditLimit = +document.getElementById("credit-limit").value;
    var oneTimeWithdrawal = +document.getElementById("one-time-withdrawal").value;
    var daysWithoutPercents = +document.getElementById("days-without-percents").value;
    var annualMaintenance = +document.getElementById("annual-maintenance").value;
    var debetPercent = +document.getElementById("debet-percent").value / 36500;
    var days = +document.getElementById("days-range").value;
    var debetBalance = 0;
    var withdrawalTimers = new WithdrawalTimer;
    withdrawalTimers = [];
    var profitCount = [];
    var dayCount = [];
    profitCount[0] = -annualMaintenance;
    dayCount[0] = 0;
    var creditTimer = 0;
    var profitDay = -2;
    var profitDayProfit = 0;
    var bool = true;
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
        profitCount[day + 1] = profitCount[day] +  debetBalance * debetPercent;
        dayCount[day + 1] = day + 1;
        for (var i = 0; i < withdrawalTimers.length; i++) {
            withdrawalTimers[i].timer--;
        };
        creditTimer--;
        if (profitCount[day+1]>0 && bool) {
            profitDay = day+1;
            profitDayProfit = profitCount[day+1];
            bool = false;
        };
        if (day%365==0 && day!=0) {
            profitCount[day+1] -= annualMaintenance;
        };
    }
    var myChart = echarts.init(document.getElementById('main-chart'));
    option = {
        title: {
            text: 'График прибыли'
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    title: {
                        zoom: 'Приблизить',
                        back: 'Вернуть исходный масштаб'
                    },
                    yAxisIndex: 'none'
                },
                saveAsImage: {
                    title: 'Сохранить как картинку'
                }
            }
        },
        xAxis: {
            type: 'category',
            data: dayCount
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: 'сумма накопленных процентов',
            type: 'line',
            smooth: true,
            data: profitCount,
            markPoint: {
                data: [
                    {name: 'бинго!', value: 'бинго!', yAxis: profitDayProfit, xAxis: profitDay}
                ]
            }
        }]
    };
    myChart.setOption(option);
    document.getElementById("day-profit").value = profitDay;
    document.getElementById("profit").value = profitCount[days];
}