
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
  function load(start, minutes) {
    var diff = Date.now() - start;
    var minutes = 15;
    var ONE_DAY = 24 * 60 * 60 * 1000;
    for (var i = 0; i < 14; i++) {
      if (diff < (i * ONE_DAY)) {
        minutes = i;
        break;
      }
    }
    d3.json('/metrics/transactions?start=' + start + '&minutes=' + minutes, function(data) {
      var points = data.datapoints;
      for (var i = 0; i < points.length; i++) {
        points[i].date = new Date(points[i].timestamp);
        points[i].avg = points[i].sum / (minutes * 60);
      }
      MG.data_graphic({
        title: "Transactions",
        description: "This graphic shows a time-series of downloads.",
        data: points,
        width: 600,
        height: 250,
        target: '#transactions',
        x_accessor: 'date',
        y_accessor: 'avg',
      });
    });
  };

  $(function() {
    $("#startDate").datepicker();
    $('#refresh-form').submit(function(event) {
      var d = $('#startDate').datepicker('getDate').getTime();
      console.log(d);
      load(d, 60);
      event.preventDefault();
    });
    var start = Date.now() - 3 * 24 * 60 * 60 * 1000;
    load(start, 60);
  });
});
