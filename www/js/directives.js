angular.module('arbr.directives', [])
.directive('myMap', ['$rootScope', function($rootScope, $compile, $scope, $parse) {
    // directive link function
    var link = function(scope, element, attrs) {
        var map, infoWindow;
        var markers = [];
        
        // map config
        var mapOptions = {
            center: new google.maps.LatLng(37.7833,-122.4167),
            zoom: 12,
            scaleControl: false,
            streetViewControl: false,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        
        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
                scope.googleMap = map;
            }

            console.log(scope.googleMap);
        }
        
        // place a marker
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                animation: google.maps.Animation.DROP,
                icon: 'img/arbr-map-marker.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
            // var stringToHTML = angular.element(contentString);
            // console.log(stringToHTML);
            // var compiled = $compile(contentString);
            // console.log(compiled);
            
            google.maps.event.addListener(marker, 'click', function (scope) {
                // console.log($compile(contentString));
                // close window if not undefined

                var contentString = "<h4 class=windowTitle ng-click='clickTest()'>" + content + "</h4>";
                var template = angular.element($compile(contentString)(scope));

                // var compiled = compile(content)(scope);

                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: contentString
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });

            // console.log(element.find('.windowTitle').addClass('test'));
        }
        
        // Initilize our map!
        initMap();

        // Get some data from Firebase
        var firebaseRef = new Firebase("https://arbr-project.firebaseio.com/");
        firebaseRef.on("value", function(snapshot) {
            rawLocationData = snapshot.val();
            usableLocationData = rawLocationData[0].locations;

            for(i in usableLocationData) {
                locName = usableLocationData[i].name;
                locPosLat = usableLocationData[i].pos[0];
                locPosLong = usableLocationData[i].pos[1];
                locPosLatLong = new google.maps.LatLng(locPosLat, locPosLong);
                setMarker(map, locPosLatLong, locName, locName);
            }
        });


        
        // setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
        // setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
        // setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
    };
    
    return {
        restrict: 'AEC',
        scope: { googleMap: "@" },
        template: '<div id="gmaps"></div>',
        replace: true,
        transclude: true,
        link: link
    };
}]);