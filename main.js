// register the grid component
var globalData = [
      { name: 'aaa', state: 'open', subtype: 'awef', submitter: 'a', requester: 'b' },
      { name: 'bbb', state: 'closed', subtype: 'awef', submitter: 'a', requester: 'b' },
      { name: 'ccc', state: 'closed', subtype: 'awef', submitter: 'a', requester: 'b' },
      { name: 'ddd', state: 'open', subtype: 'awef', submitter: 'a', requester: 'b' }
    ];

var globalColumns = ['name', 'state', 'subtype', 'submitter', 'requester'];


Vue.component('demo-grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders,
      selectedCols: globalColumns,
      settingsCB: false,
      allColumns: []
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    showSettings: function(){
      if (!this.settingsCB)
      {
        this.allColumns = globalColumns;
      }
      else
      {
        this.allColumns = [];
      }
    },
    refresh: function() {
      refreshGrid(this.selectedCols);
    }
  },
  watch: {
    selectedCols: function (newVal, oldVal) {
      // Do what you want with the selected objects:
      refreshGrid(this.selectedCols);
    }
  },
})

// bootstrap the demo
var demo = new Vue({
  el: '#chart',
  data: {
    searchQuery: '',
    gridColumns: globalColumns,
    gridData: globalData,
    allColumns: [],
    selectedCols: globalColumns,
    settingsCB: false
  }
});

function refreshGrid(columns) {
  var orderedCols = [];
  for (let i=0; i<globalColumns.length; i++)
  {
    if (columns.indexOf(globalColumns[i]) > -1)
    {
      orderedCols.push(globalColumns[i]);
    }
  }
  let data = globalData;
  let newData = [];
  for (let i=0; i<data.length; i++)
  {
    let content = {};
    for (let j=0; j<orderedCols.length; j++)
    {
      if (data[i][orderedCols[j]] != undefined)
      {
        content[orderedCols[j]] = data[i][orderedCols[j]];
      }
    }
    newData.push(content);
  }
  demo.gridColumns = orderedCols;
  demo.gridData =  newData;
}
