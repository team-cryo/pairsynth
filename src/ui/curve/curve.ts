abstract class Curve
{
    protected id: string;
    protected type: string;
    private label: string;

    constructor(id: string, type: string, label: string)
    {
        this.id = id;
        this.type = type;
        this.label = label;
    }
    
    protected abstract getValues(): number[];

    public toChart(): Chart
    {
        const data = this.getValues();
        const labels = _.range(-1, 1, 2/data.length).concat([1]);
        return new Chart($("#" + this.id), {
            type: this.type,
            data: {
                labels: labels,
                datasets: [{
                    label: this.label,
                    data: data,
                    borderColor: "blue",
                    fill: false,
                    pointRadius: 0,
                    pointBorderWidth: 0,
                    spanGaps: false,
                    borderWidth: 1,
                    showLines: true,
                    lineTension: 0,
                    axis: "x",
                    autoSkipPadding: 100
                }]
            },
            options: {
                animation: {
                    duration: 100, // general animation time
                },
                legend: {display: false},
                maintainAspectRatio: true,
                aspectRatio: 10,
                scales: {
                    xAxes: [{bounds: "data", ticks: {min: -1, max: 1}},],
                    yAxes: [{ticks: {min: -1, max: 1}}]
                }
            }
        });
    }
}