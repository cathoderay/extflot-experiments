/* $Id:$
 * vim:sw=2:ts=8:sts=2:et:ft=javascript
 * Released under the MIT license or Ext Open Source License by NCS, December 2008
 */

Ext.onReady(function() {
  var d1 = [];
  for (var i = 0; i < 14; i += 0.5) { d1.push([i, Math.sin(i)]); }
  var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];
  var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];
  var data = [d1, d2, d3];

  var win = new Ext.Window({
    title: 'Basic',
    width: 600,
    height: 480,
    layout: 'fit',
    items: [{
      xtype: 'flot',
      cls: 'x-panel-body',
      series: data
    }]
  });
  win.show();
});
