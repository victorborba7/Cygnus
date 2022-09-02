var latlng = new google.maps.LatLng(37.6922, -97.3372);
var geocoder = new google.maps.Geocoder();
const queryString = window.location.search;
var path = window.location.pathname.split("/")
let company = path[path.length - 1];
let company_id;
let outside_images = 0;
let inside_images = 0;
let first_load = 1;
//let url = "http://localhost:3000";
let url = "http://162.240.67.88:3000";

var mapOptions = {
	center: latlng,
	zoom: 1,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	disableDefaultUI: true,
	scaleControl: true,
	scaleControlOptions: {
		position: google.maps.ControlPosition.RIGHT_BOTTOM
	},
	zoomControl: true,
	zoomControlOptions: {
		position: google.maps.ControlPosition.RIGHT_TOP
	}

};

var map = new google.maps.Map(document.getElementById('map'), mapOptions);
var circlePlane1;
var circlePlane2;
var marker;
var imagePin = 'images/pin.svg';

function DrawPlane(id) {
	if ($("#" + id + " option:selected").val() != 0) {
		setTimeout(function () {

			var plane = $("#" + id + " option:selected").data("data").radius;
			if (circlePlane1 != undefined && id == "planes1") circlePlane1.setMap(null)
			if (circlePlane2 != undefined && id == "planes2") circlePlane2.setMap(null)
			if (id == "planes1") {
				var color = "#aa9a6e"
				circlePlane1 = new google.maps.Circle({
					strokeColor: color, // Range Ring Color
					strokeWeight: 2,
					fillOpacity: 0,
					map: map,
					center: latlng,
					radius: Math.abs(plane) * 1610 // Radius Multiplier
				});
			}

			if (id == "planes2") {
				var color = "#087fc0"
				circlePlane2 = new google.maps.Circle({
					strokeColor: color, // Range Ring Color
					strokeWeight: 2,
					fillOpacity: 0,
					map: map,
					center: latlng,
					radius: Math.abs(plane) * 1610 // Radius Multiplier
				});
			}
		}, 500)
	}
}

function getAircrafts() {
	$(".overlay").css("display", "block");
	$.ajax({
		method: "GET",
		crossDomain: true,
		url: url + "/aircraft/list?company_id=" + company_id,
		success: function (data) {
			data.forEach(function (value) {
				$("#aircrafts").append("<option value=" + value.id + ">" + value.model + "</option>");
			})
			$("#aircrafts").val(data[0].id).change()
		},
		complete: function () {
			$(".overlay").css("display", "none");
		}
	})
}

function getCompanyByName() {
	$(".overlay").css("display", "block");
	$.ajax({
		method: "GET",
		crossDomain: true,
		url: url + "/company/get/name?name=" + company,
		success: function (data) {
			company_id = data.id
			$("#logo").attr("src", data.photo_path);
			getAircrafts();
			getAvailableAircrafts();
		},
		complete: function () {
			$(".overlay").css("display", "none");
		}
	})
}

function getAvailableAircrafts() {
	$(".overlay").css("display", "block");
	$.ajax({
		method: "GET",
		url: url + "/aircraft/available/list?company_id=" + company_id,
		success: function (data) {
			$('#aeronaves-disponiveis').empty();
			data.forEach(el => {
				var div = "<div class='available_photos'>"
				el.outside_files.forEach(photo => {
					div += `<img class="card-img-top" src="${el.photos_path}/externo/${photo}" alt="Card imagem"></img>`
				});
				div += "</div>"
				$('#aeronaves-disponiveis').append(`
				<div class="card card-disponiveis">
					${div}
					<div class="card-body">
						<h5 class="card-title">${el.model}</h5>
						<p class="card-text">${el.first_year_production} | ${el.tbo} horas totais FOB USA</p>
						<a href="#" class="btn btn-danger">TENHO INTERESSE</a>
					</div>
				</div>
				`);
			});

			$(".available_photos").slick({
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				fade: true,
				autoplay: true,
				autoplaySpeed: 2000,
				arrows: false
			});

			$('#aeronaves-disponiveis').slick({
				infinite: true,
				slidesToShow: 3,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 2000,
				arrows: true
			});
		},
		complete: function () {
			$(".overlay").css("display", "none");
		}
	})
}

function getAircraft() {
	$(".overlay").css("display", "block");
	$.ajax({
		method: "GET",
		crossDomain: true,
		url: url + "/aircraft/get?id=" + $("#aircrafts option:selected").val(),
		success: function (data) {
			if (first_load == 1) {

				$('.avioes').empty()

				data.outside_files.forEach((value) => {
					$(".avioes").append(`<img src="${data.photos_path}/externo/${value}" />`)
				});

				$('.avioes').slick({
					infinite: true,
					dots: true,
					arrows: false,
					autoplay: true,
					autoplaySpeed: 2000,
					fade: true,
					cssEase: 'linear'
				});

				outside_images = data.outside_files.length

				$('.fotosdeaviao').empty();

				data.inside_files.forEach((value) => {
					$(".fotosdeaviao").append(`<img src="${data.photos_path}/interno/${value}" />`)
				});


				$('.fotosdeaviao').slick({
					infinite: true,
					slidesToShow: 4,
					slidesToScroll: 1,
					dots: false,
					arrows: false,
					autoplay: true,
					autoplaySpeed: 2000,
				});

				inside_images = data.inside_files.length

				first_load = 0;
			}
			else {
				var slideIndex = outside_images;
				for (i = 0; i < outside_images; i++) {
					$('.avioes').slick('slickRemove', slideIndex - 1);
					if (slideIndex !== 0) {
						slideIndex--;
					}
				};


				data.outside_files.forEach((value) => {
					$('.avioes').slick('slickAdd', `<img src="${data.photos_path}/externo/${value}" />`);
				});

				outside_images = data.outside_files.length;

				var slideIndex = inside_images;
				for (i = 0; i < inside_images; i++) {
					$('.fotosdeaviao').slick('slickRemove', slideIndex - 1);
					if (slideIndex !== 0) {
						slideIndex--;
					}
				};


				data.inside_files.forEach((value) => {
					$('.fotosdeaviao').slick('slickAdd', `<img src="${data.photos_path}/interno/${value}" />`);
				});

				inside_images = data.inside_files.length;
			}

			$("#mapa_assentos").attr("src", data.photos_path + "/" + data.mapa_assentos);
			$("#tbo").text(data.tbo)
			$("#engine").text(data.engine)
			$("#first_year_production").text(data.first_year_production)
			$("#max_takeoff_weight").text(data.max_takeoff_weight)
			$("#model").text(data.model)
			$("#model-row").text(data.model)
			$("#info-model").text(data.model)
			$("#series").text(data.series)
			$("#max_capacity").text(data.max_capacity)
			$("#max_cruise_speed").text(data.max_cruise_speed)
			$("#max_range").text(data.max_range)
			$("#max_operating_altitude").text(data.max_operating_altitude)
			$("#wingspan").text(data.wingspan)
			$("#length").text(data.length)
			$("#max_tail_height").text(data.max_tail_height)
			$("#min_takeoff_distance").text(data.min_takeoff_distance)
			$("#description_pt").text(data.description)
			$("#description_en").text(data.description_en)
		},
		complete: function () {
			$(".overlay").css("display", "none");
		}
	})
}

$("#planes1, #planes2").change(function () {
	DrawPlane($(this).attr("id"))
})

$("#english").click(function () {
	var path = window.location.pathname.split("/")
	let company = path[path.length - 1];
	window.location = "/en/" + company
})

$("#portugues").click(function () {
	var path = window.location.pathname.split("/")
	let company = path[path.length - 1];
	window.location = "/" + company
})

$(document).ready(function () {
	getCompanyByName();

	$("#aircrafts").change(function () {
		getAircraft();
	})

	$("#airports").selectize({
		options: airportsdb,
		valueField: 'name',
		labelField: 'name',
		searchField: ['name'],
		placeholder: "Aeroportos",
		closeAfterSelect: true,
		maxOptions: 10,
		onChange: function (value) {
			var filtered = airportsdb.filter(function (obj) {
				return obj.name.indexOf(value) > -1;
			});
			var plane = filtered[0]
			var lat = plane.lat;
			var lng = plane.lng;
			latlng = new google.maps.LatLng(lat, lng);
			geocoder.geocode({ 'location': latlng }, function (results, status) {
				map.setCenter(results[0].geometry.location);

				if (marker != undefined) marker.setMap(null);

				marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
					icon: imagePin
				});

				DrawPlane("planes1");
				DrawPlane("planes2");
			})
		}
	});

	$(".items").click(function () {
		$("#airports").selectize()[0].selectize.clear();
	});
});