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
        xaxis: { labelHeight: 40, mode: "time" }, 
        yaxis: { labelWidth: 20 },
        selection: {mode: null},
        lines: { steps: true, show: true, lineWidth: 0.5, fill: true },
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
                console.debug("sending JSON request")
                mainStore.setBaseParam("from", Math.floor(ranges.xaxis.from));
                mainStore.setBaseParam("to", Math.floor(ranges.xaxis.to));
                mainStore.setBaseParam("resolution", parseInt(mainFlot.getBox().width/2));
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
        id: 'cpu',
        width: 600,
        title: 'CPU',
        layout: 'column',
        items: [mainFlot, birdViewFlot],
        defaults: {
            cls: 'x-panel-body'
        }
    });
    win.show();
});
