(function() {
  var datatable, format, multisort, order, process, score;

  order = function(a, b) {
    var ret;
    ret = a - b;
    if (ret !== 0) return ret /= Math.abs(ret);
  };

  multisort = function(arr, propfuncs) {
    return arr.sort(function(a, b) {
      var numa, numb, propfunc, ret, _i, _len;
      for (_i = 0, _len = propfuncs.length; _i < _len; _i++) {
        propfunc = propfuncs[_i];
        if (typeof propfunc === 'function') {
          numa = propfunc(a);
          numb = propfunc(b);
          ret = order(numa, numb);
        } else {
          ret = order(a[propfunc], b[propfunc]);
        }
        if (ret !== 0) break;
      }
      return ret;
    });
  };

  score = function(obj) {
    var n;
    n = 100 - obj.CPU;
    n += obj.Network * 1;
    n += 100 - (obj['Disk Transfer'] * 1.5);
    return 1.0 / n;
  };

  process = function(results) {
    var row, _i, _len;
    multisort(results, [score]);
    for (_i = 0, _len = results.length; _i < _len; _i++) {
      row = results[_i];
      try {
        row.Total = Math.round(1.0 / score(row));
        row.date = new Date(row.date).toLocaleDateString();
        row.CPU = 100 - row.CPU;
        row['Disk Transfer'] = 100 - (row['Disk Transfer'] * 1.5);
        row.Network = Math.round(row.Network);
      } catch (e) {
        console.log(e);
      }
    }
    return results;
  };

  format = function(name, val) {
    if (!(val != null)) {
      return '';
    } else {
      return val;
    }
  };

  datatable = function(rows) {
    var col, cols, out, row, _i, _j, _k, _len, _len2, _len3;
    cols = ['Provider', 'RAM', 'IP address', 'Network', 'CPU', 'Disk Transfer', 'Total'];
    out = "<table><thead>";
    for (_i = 0, _len = cols.length; _i < _len; _i++) {
      col = cols[_i];
      out += "<th>" + col + "</th>";
    }
    out += "</thead><tbody>";
    for (_j = 0, _len2 = rows.length; _j < _len2; _j++) {
      row = rows[_j];
      out += "<tr>";
      for (_k = 0, _len3 = cols.length; _k < _len3; _k++) {
        col = cols[_k];
        out += "<td>" + (format(col, row[col])) + "</td>";
      }
      out += "</tr>";
    }
    return out += "</tbody></table>";
  };

  $(function() {
    return $.getJSON('/results', function(arr) {
      var sorted;
      sorted = process(arr);
      console.log(sorted);
      return $('#resultshere').html(datatable(sorted));
    });
  });

}).call(this);
