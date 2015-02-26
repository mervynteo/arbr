angular.module('arbr.directives', [])
.directive('myMap', ['$rootScope', '$compile', function($rootScope, $compile, $scope, $parse) {
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
            }
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

                function clickTest() {
                    console.log('raw');
                }

                var contentString = "<div ng-click='clickTest()'class='infowindow'><h4 class=windowTitle>" + content + "</h4><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam eos non eveniet labore velit itaque tempora numquam necessitatibus, earum ut, mollitia, eius blanditiis a iusto dicta? Commodi praesentium optio libero.</p></div>";
                var compiled = $compile(contentString)(scope);
                console.log(compiled);

                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: compiled[0],
                    maxWidth: 200
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