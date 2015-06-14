requirejs(['d3', 'metricsgraphics'], function(d3, mg) {

  $(d3.json('/metrics/transactions', function(data) {
    console.log(data);
    var points = data.datapoints;
    for (var i = 0; i < points.length; i++) {
      points[i].date = new Date(points[i].timestamp);
    }
    console.log(points);
    MG.data_graphic({
      title: "Downloads",
      description: "This graphic shows a time-series of downloads.",
      data: points,
      width: 600,
      height: 250,
      target: '#transactions',
      x_accessor: 'date',
      y_accessor: 'sum',
    })
  }));
});
