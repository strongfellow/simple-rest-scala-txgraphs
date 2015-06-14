
requirejs.config({
  shim: {
    'metricsgraphics': {
      deps: ['bootstrap']
    },
    'bootstrap' : { 'deps' :['jquery'] }
  },
  paths: {
    'bootstrap': '//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min'
  }
});

requirejs(['d3', 'metricsgraphics', 'jquery-ui', 'bootstrap'], function(d3, mg) {

  $(function() {

    $("#startDate").datepicker();
    
    var start = Date.now() - 3 * 24 * 60 * 60 * 1000;
    d3.json('/metrics/transactions?start=' + start, function(data) {
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
