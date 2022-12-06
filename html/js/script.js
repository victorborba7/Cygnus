var path = window.location.pathname.split("/")
let company = path[path.length - 1];
let company_id;
let outside_images = 0;
let inside_images = 0;
let first_load = 1;
let ficha = $("body").attr("id") == "en" ? "I'M INTERESTED" : "TENHO INTERESSE";
let interesse = $("body").attr("id") == "en" ? "SPECIFICATIONS" : "FICHA TÉCNICA";

//let url = "http://localhost:8000";
let url = "http://162.240.67.88:8000";


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
			$("#logo").attr("src", "/" + data.photo_path);
			getAircrafts();
			getAvailableAircrafts();
		}
	})
}

function getAvailableAircrafts() {
	$(".overlay").css("display", "block");
	$.ajax({
		method: "GET",
		url: url + "/available/aircraft/list?company_id=" + company_id,
		success: function (data) {
			if (data.length == 0) {
				$(".hide-empty").css("display", "none")
				$(".show-empty").css("display", "block")
			} else {
				$(".show-empty").css("display", "none")
			}
			$('#aeronaves-disponiveis').empty();
			data.forEach(el => {
				var div = "<div class='available_photos'>"
				var div2 = `<div id="available_photos_ficha${el.id}" class='available_photos_ficha col-10'>`
				var div3 = `<div id="available_photos_ficha_nav${el.id}" class='available_photos_ficha_nav col-8'>`
				el.files.forEach(photo => {
					div += `<img class="card-img-top" src="${el.photos_path}/${photo}" alt="Card imagem" />`
					div2 += `<div class="img-holder-ficha"><img class="card-img-top-big" src="${el.photos_path}/${photo}" alt="Card imagem" /></div>`
					div3 += `<img class="card-img-top-ficha" src="${el.photos_path}/${photo}" alt="Card imagem" />`
				});
				div += "</div>"
				div2 += "</div>"
				div3 += "</div>"
				$('#aeronaves-disponiveis').append(`
				<div class="card-holder">
					<div class="card card-disponiveis">
						${div}
						<div class="card-body">
							<h5 class="card-title">${el.model}</h5>
							<div class="row">
								<div class="col-12 mb-2"><button id="open${el.id}" class="btn btn-success middle">${ficha}</button></div>
								<div class="col-12"><a href="#form-contato" id="interesse${el.id}" data-model="${el.model}" data-model="${el.year}" class="btn btn-danger middle">${interesse}</a></div>
							</div>
						</div>
					</div>
				<div>
				`);

				$('#modal-holder').append(`
				<div id="modal${el.id}" class="d-flex flex-column justify-content-around modal" style="display: none !important">
					<div id="close${el.id}" class="close">X</div>
					<h2>${el.model}</h2>
					<h3>${el.year}</h3>
					<div class="row justify-content-center justify-content-sm-around">
						<div class="col-12 col-md-8">
							<div class="row justify-content-around">
								${div2}
								${div3}
							</div>
						</div>
						<div class="col-12 col-md-4 d-flex flex-column justify-content-around">
							<div class="row justify-content-around">
								<div class="col-3">
									<h4>Airframe</h4>
									<p>${el.airframe}</p>
								</div>
								<div class="col-3">
									<h4>Engines</h4>
									<p>${el.engines}</p>
								</div>
								<div class="col-3">
									<h4>Propeller</h4>
									<p>${el.propeller}</p>
								</div>
							</div>
							<div class="row justify-content-around">
								<div class="col-3">
									<h4>Avionics</h4>
									<p>${el.avionics}</p>
								</div>
								<div class="col-3">
									<h4>Additional Equipment</h4>
									<p>${el.additional_equipment}</p>
								</div>
								<div class="col-3">
									<h4>Interior</h4>
									<p>${el.interior_description}</p>
								</div>
							</div>
							<div class="row justify-content-around">
								<div class="col-3">
									<h4>Exterior</h4>
									<p>${el.exterior_description}</p>
								</div>
								<div class="col-3">
									<h4>Maintenance Inspection</h4>
									<p>${el.maintenance_inspection}</p>
								</div>
								<div class="col-3"></div>
							</div>
						</div>
					</div>
				</div>
				`)

				$(`#interesse${el.id}`).click(function () {
					$("#mensagem").val(`Olá, quero mais informações sobre o modelo ${el.model} do ano ${el.year}`)
				})

				$(`#close${el.id}`).click(function () {
					$(`#modal${el.id}`).attr('style', 'display:none !important');
					$(`#available_photos_ficha${el.id}`).destroy()
					$(`#available_photos_ficha_nav${el.id}`).destroy()
				})

				$(`#open${el.id}`).click(function () {
					$(`#modal${el.id}`).attr('style', 'display:flex !important');

					$(`#available_photos_ficha${el.id}`).slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						fade: true,
						arrows: false,
						asNavFor: `#available_photos_ficha_nav${el.id}`,
						infinite: true
					});

					$(`#available_photos_ficha_nav${el.id}`).slick({
						slidesToShow: 3,
						slidesToScroll: 1,
						asNavFor: `#available_photos_ficha${el.id}`,
						dots: false,
						arrows: false,
						centerMode: true,
						focusOnSelect: true,
						infinite: true
					});
				})
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

			var slides = data.length <= 4 ? data.length - 1 : 4
			if (slides <= 0) {
				slides = 1
			}

			$('#aeronaves-disponiveis').slick({
				infinite: true,
				slidesToScroll: 1,
				slidesToShow: 4,
				arrows: true,
				autoplay: true,
				autoplaySpeed: 5000,
			});
		}
	})
}

function getAircraft() {
	$(".overlay").css("display", "block");
	$("body").css("overflow", "none");
	$.ajax({
		method: "GET",
		crossDomain: true,
		url: url + "/aircraft/get?id=" + $("#aircrafts option:selected").val(),
		success: function (data) {
			if (first_load == 0) {
				$('.avioes').slick('unslick');
				$('.fotosdeaviao').slick('unslick');
			}

			$('.avioes').empty()
			$('.fotosdeaviao').empty();

			data.outside_files.forEach((value) => {
				$(".avioes").append(`<img src="${data.photos_path}/externo/${value}" />`)
			});

			$('.avioes').slick({
				infinite: true,
				dots: true,
				arrows: false,
				autoplay: true,
				autoplaySpeed: 2000,
				cssEase: 'linear'
			});

			outside_images = data.outside_files.length

			data.inside_files.forEach((value) => {
				$(".fotosdeaviao").append(`<img src="${data.photos_path}/interno/${value}" class="borda" />`)
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


			if (data.mapa_assentos != "") {
				$("#mapa-holder").css("display", "block")
				$("#mapa_assentos").attr("src", data.photos_path + "/" + data.mapa_assentos);
				$("#range-planes").removeClass("col-md-12 col-lg-12")
				$("#range-planes").addClass("col-md-5 col-lg-5")
				$("#mapa_assentos").css("display", "block");
			}
			else {
				$("#mapa-holder").css("display", "none")
				$("#range-planes").removeClass("col-md-5 col-lg-5")
				$("#range-planes").addClass("col-md-12 col-lg-12")
				$("#mapa_assentos").css("display", "none");
			}

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

$("#english").click(function () {
	var path = window.location.pathname.split("/")
	let company = path[path.length - 1];
	window.location = "/" + company
})

$("#portugues").click(function () {
	var path = window.location.pathname.split("/")
	let company = path[path.length - 1];
	window.location = "/pt/" + company
})

$(document).ready(function () {
	getCompanyByName();

	$("#aircrafts").change(function () {
		getAircraft();
	})

	var latlng = new google.maps.LatLng(37.6922, -97.3372);
	var geocoder = new google.maps.Geocoder();
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

	$("#planes1, #planes2").change(function () {
		DrawPlane($(this).attr("id"))
	})
});