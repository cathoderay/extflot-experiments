/* $Id:$
 * vim:sw=2:ts=8:sts=2:et:ft=javascript
 * Released under the MIT license or Ext Open Source License by NCS, December 2008
 */

Ext.onReady(function() {
  var item1 = [[1, 1], [4, 1], null, [6, 1], [7, 1], null, [8.5, 1], [10.5, 1]];
  var item2 = [[1, 2], [5, 2], null, [7, 2], [11, 2]];

  var win = new Ext.Window({
    title: 'Discontinious LInes',
    width: 600,
    height: 300,
    layout: 'fit',
    items: [{
      xtype: 'flot',
      lines: {
        show: true,
        lineWidth: 20
      },
      xaxis: {
        min: 0, 
        max: 12,
        ticks: [
          [1,  'Jan'],
          [2,  'Feb'],
          [3,  'Mar'],
          [4,  'Apr'],
          [5,  'May'],
          [6,  'Jun'],
          [7,  'Jul'],
          [8,  'Aug'],
          [9,  'Sep'],
          [10, 'Oct'],
          [11, 'Nov'],
          [12, 'Dec']
        ]
      },
      yaxis: {
        min: 0, 
        max: 3,
        ticks: [
          [1, 'Item1'],
          [2, 'Item2']
        ]
      },
      cls: 'x-panel-body',
      series: [{
        data: item1
      },{
        data: item2
      }]
    }]
  });
  win.show();
});
