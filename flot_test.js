/* $Id:$
 * vim:sw=2:ts=8:sts=2:et:ft=javascript
 * Released under the MIT license or Ext Open Source License by NCS, May 2009
 */

Ext.onReady(function() {

    var OurFlot = Ext.ux.Flot.extend({
        updateSeriesFromStore: function(store) {
            var series = [];
            for (var i = 0; i < (store.data.items.length); i++) {
                series.push({label: store.data.items[i].data['label'], data: store.data.items[i].data['data']});
            }
            this.setData(series);
            this.redraw();
        }
    });

    var mainFlot = new OurFlot({
        id: 'main-flot',
        xtype: 'flot',
        height: 300,
        shadowSize: 0,
        points: { radius: 1, fill: false },
        xaxis: {
            labelHeight: 40,
            tickFormatter: function (val, axis) {
                var hour = String(val).substring(8);
                if (hour != "00") 
                    return hour + ":00";
                else
                    return String(val).substring(6, 8);
        }}, 
        yaxis: { labelWidth: 20 },
        lines: { show: true, lineWidth: 1, fill: true },
        grid:{ borderWidth:1, borderColor:"#aaa",markings: Ext.ux.Flot.grid.weekendMarkings},
        labelBoxBorderColor: { color: "#000" },
        series: []
    });

    var birdViewFlot = new OurFlot({
        id: 'birdview-flot',
        xtype: 'flot',
        height: 50,
        shadowSize: 0,
        tooltip: false,
        lines: { show: true, lineWidth: 0, fill: true },
        xaxis: { mode: "time", ticks: 0 },
        yaxis: { ticks: 0 },
        selection: { mode: "x"},
        points: { show: false, radius: 0 },
        grid:{ borderWidth: 0, borderColor: "#222" },
        legend: { show: false },
        crosshair: { mode: "x" },
        series: [],
        listeners: {
            plotselected: function(flot, event, ranges, item) {
                mainStore.setBaseParam("from", Math.floor(ranges.xaxis.from));
                mainStore.setBaseParam("to", Math.floor(ranges.xaxis.to));
                mainStore.load();
            }
        }
    });

    var mainStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            //url: "/rest/history",
            url: "/flot_test.json",
            method: "GET"
        }),
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: "items",
            fields: ['label', 'data', 'resolution']
        }),
        baseParams : {
            property: "",
            stream: "",
            hosts: [],
            from: 0,
            to: 0
        },
        fields: ['label', 'data', 'resolution'],
        listeners: {
            load: {
                fn: function(store) {
                    mainFlot.updateSeriesFromStore(store);
                }
            }
        }
    });

    var birdViewStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            //url: "/rest/history",
            url: "/flot_test.json",
            method: "GET"            
        }),
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: "items",
            fields: ['label', 'data', 'resolution']
        }),
        baseParams : {
            property: "",
            stream: "",
            hosts: [],
            from: 0,
            to: 0
        },
        fields: ['label', 'data', 'resolution'],
        listeners: {
            load: {
                fn: function(store) {
                    birdViewFlot.updateSeriesFromStore(store);
                    mainFlot.updateSeriesFromStore(store);
                }
            }
        }
    });

    var win = new Ext.Window({
        title: 'CPU',
        id: 'cpu',
        layout: 'column',
        width: 600,
        defaults: {
            cls: 'x-panel-body'
        },
        items: [mainFlot, birdViewFlot]
    });
    win.show();
});
