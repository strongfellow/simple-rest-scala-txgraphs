requirejs(['d3', 'metricsgraphics', 'jquery-ui'], function(d3, mg, jqui) {

  $(function() {

    $("#startDate").datepicker();

    d3.json('/metrics/transactions', function(data) {
      var points = data.datapoints;
      for (var i = 0; i < points.length; i++) {
        points[i].date = new Date(points[i].timestamp);
      }
      MG.data_graphic({
        title: "Transactions",
        description: "This graphic shows a time-series of downloads.",
        data: points,
        width: 600,
        height: 250,
        target: '#transactions',
        x_accessor: 'date',
        y_accessor: 'sum',
      });
    });
  });
});
