var center = new google.maps.LatLng(45.7, 3.216667);
var zoom = 6;
var legend_width = '150px';
var tableid = 3635199;
var location_column = 'geometry';
var colors = ['#D01C8B','#F1B6DA','#F7F7F7','#B8E186','#4DAC26'];
colors = ['#FEF0D9','#FDCC8A','#FC8D59','#E34A33','#B30000'];
    var columns = {
  'Winner': [
    {}
  ],
'Francois HOLLANDE, Socialist, %': [
   
 {
      'min': 15,
      'max': 25,
      'color': colors[1]
    },
    {
      'min': 25,
      'max': 35,
      'color': colors[2]
    },
    {
      'min': 35,
      'max': 45,
      'color': colors[3]
    },
    {
      'min': 45,
      'max': 60,
      'color': colors[4]
    }
  ],
'Nicolas SARKOZY, UMP, %': [
    {
      'min': 15,
      'max': 25,
      'color': colors[1]
    },
    {
      'min': 25,
      'max': 35,
      'color': colors[2]
    },
    {
      'min': 35,
      'max': 45,
      'color': colors[3]
    },
    {
      'min': 45,
      'max': 60,
      'color': colors[4]
    }
],
'Marine LE PEN, Nat Front, %': [
        {
      'min': 1,
      'max': 7,
      'color': colors[1]
    },
{
      'min': 7,
      'max': 14,
      'color': colors[2]
    },
    {
      'min': 14,
      'max': 21,
      'color': colors[3]
    },
    {
      'min': 21,
      'max': 30,
      'color': colors[4]
    }
],
'Eva JOLY, Green, %': [
        {
      'min': 1,
      'max': 2,
      'color': colors[1]
    },
{
      'min': 2,
      'max': 3,
      'color': colors[2]
    },
    {
      'min': 3,
      'max': 4,
      'color': colors[3]
    },
    {
      'min': 4,
      'max': 6,
      'color': colors[4]
    }
],
'Turnout, %': [
        {
      'min': 70,
      'max': 75,
      'color': colors[1]
    },
{
      'min': 75,
      'max': 80,
      'color': colors[2]
    },
    {
      'min': 80,
      'max': 85,
      'color': colors[3]
    },
    {
      'min': 85,
      'max': 90,
      'color': colors[4]
    }
]
}

var map, layer, geocoder;

jQ(document).ready(function() {
  initialize();
});

function initialize() {
  
  map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: center,
    zoom: zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  
  var style = [
    {
      featureType: 'administrative',
      elementType: 'all',
      stylers: [
        { visibility: 'off' }
      ]
    },{ elementType: "labels", stylers: [ { saturation: -100 } ] },{ elementType: "geometry", stylers: [ { gamma: 0.78 }, { saturation: -100 }, { lightness: 98 } ] },{ featureType: "road", elementType: "geometry", stylers: [ { lightness: -13 } ] }
  ];

  geocoder = new google.maps.Geocoder();

  var styledMapType = new google.maps.StyledMapType(style, {
    map: map,
    name: 'Styled Map'
  });

  map.mapTypes.set('map-style', styledMapType);
  map.setMapTypeId('map-style');

  
  layer = new google.maps.FusionTablesLayer({
    query: {
      select: location_column,
      from: tableid
    }
  });
  layer.setMap(map);
  
  init_selectmenu();
  addStyle(getKey());

}
function usePostcode(address) {
  geocoder.geocode({'address': address}, function (results, status) {
    console.log(results);
    map.setCenter(results[0].geometry.location);
    map.setZoom(12);
  });
}



function getKey() {
  for(key in columns) {
    return key;
  }
}

// Initialize the drop-down menu
function init_selectmenu() {
  var selectmenu = document.getElementById('selector');
  for(column in columns) {
    var option = document.createElement('option');
    option.setAttribute('value', column);
    option.innerHTML = column;
    selectmenu.appendChild(option);
  }
}

// Apply the style to the layer
function addStyle(column) {
  var defined_styles = columns[column];
  var styles = new Array();
  
  for(defined_style in defined_styles) {
    var style = defined_styles[defined_style];
    styles.push({
      where: generateWhere(column, style.min, style.max),
      polygonOptions: {
        fillColor: style.color,
        fillOpacity: 0.728,
        strokeOpacity: 0.3
      }
    });
  }

  layer.set('styles', styles);
  updateLegend(column);
}

// Create the where clause
function generateWhere(column_name, low, high) {
  var whereClause = new Array();
  whereClause.push("'");
  whereClause.push(column_name);
  whereClause.push("' >= ");
  whereClause.push(low);
  whereClause.push(" AND '");
  whereClause.push(column_name);
  whereClause.push("' < ");
  whereClause.push(high);
  return whereClause.join('');
}

// Create the legend with the corresponding colors
function updateLegend(column) {
  var legendDiv = document.createElement('div');
  var legend = new Legend(legendDiv, column);
  legendDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop();
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendDiv);
}

// Generate the content for the legend
function Legend(controlDiv, column) {
  controlDiv.style.padding = '10px';
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '1px';
  controlUI.style.width = legend_width;
  controlUI.title = 'Legend';
  controlDiv.appendChild(controlUI);
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';

  controlText.innerHTML = legendContent(column);
  controlUI.appendChild(controlText);
}

function legendContent(column) {
  var defined_styles = columns[column];
  var controlTextList = new Array();

  if (column == 'Winner') {

    controlTextList.push('<p><b>Winner</b</p>');
    controlTextList.push('<div style="background-color: #E12222; height: 20px; width: 20px; margin: 3px; float: left;"></div>Francois Hollande<br style="clear: both;" />')
    controlTextList.push('<div style="background-color: #225C97; height: 20px; width: 20px; margin: 3px; float: left;"></div>Nicolas Sarkozy<br style="clear: both;" /><br />')
    controlTextList.push('<div style="background-color: #4c1130; height: 20px; width: 20px; margin: 3px; float: left;"></div>Marine Le Pen<br style="clear: both;" /><br />')

  } else {
    controlTextList.push('<p><b>');
    controlTextList.push(column);
    controlTextList.push('</b></p>');
    for(defined_style in defined_styles) {
      var style = defined_styles[defined_style];
      controlTextList.push('<div style="background-color: ');
      controlTextList.push(style.color);
      controlTextList.push('; height: 20px; width: 20px; margin: 3px; float: left;"></div>');
      controlTextList.push(style.min);
      controlTextList.push(' to ');
      controlTextList.push(style.max);
      controlTextList.push('<br style="clear: both;"/>');
    }

    controlTextList.push('<br />');
  }

  return controlTextList.join('');
}


