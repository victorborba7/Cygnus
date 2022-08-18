// acompanha o formulário de cotação de seguros diverso
$(function() {

    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            // Prevent spam click and default submit behaviour
            $("#btnenviar").attr("disabled", true);
            event.preventDefault();
            
            // get values from FORM
            var nome = $("input#nome").val();
			var endereco = $("input#endereco").val();
			var numero = $("input#numero").val();
			var complemento = $("input#complemento").val();
            var cep = $("input#cep").val();
			var cidade = $("input#cidade").val();
			var fone = $("input#fone").val();
            var email = $("input#email").val();
            var firstName = nome; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = nome.split(' ').slice(0, -1).join(' ');
            }
            // START get values from other fields 
            
            var rg = $("input#rg").val();
            var orgaoemissor = $("input#orgaoemissor").val();
            var dataemissao = $("input#dataemissao").val();
            var cpf = $("input#cpf").val();
            var nascimento = $("input#nascimento").val();
            var sexo = $("select#sexo").val();
            var retornovia = $("select#retornovia").val();
			var fabricante = $("input#fabricante").val();
            var modelo = $("input#modelo").val();
            var anofab = $("input#anofab").val();
            var anomodelo = $("input#anomodelo	").val();
            var placa = $("input#placa").val();
            var chassi = $("input#chassi").val();
			var zerokm = $("select#zerokm").val();
            var alienacao = $("select#alienacao").val();
			var antifurto = $("select#antifurto").val();
            var tipoantifurto = $("input#tipoantifurto").val();
            var temseguro = $("select#temseguro").val();
            var seguradora = $("input#seguradora").val();
            var classebonus = $("input#classebonus").val();
            var vctoseguro = $("input#vctoseguro").val();
            var regiaocircula = $("input#regiaocircula").val();
            var utilizacao = $("select#utilizacao").val();
			var condsexo	= $("select#condsexo").val();
            var condcpf	= $("input#condcpf").val();
            var condestcivil	= $("input#condestcivil").val();
            var condnasc	= $("input#condnasc").val();
            var condprofissao	= $("input#condprofissao").val();
			var condcnh	= $("input#condcnh").val();
            var guardacasa	  = $("select#guardacasa").val();
            var guardatrabalho  = $("select#guardatrabalho").val();
            var guardacolegio  = $("select#guardacolegio").val();
			var residepessoa  = $("select#residepessoa").val();
			var residesexo  = $("select#residesexo").val();
			var condtrabalhae	= $("select#condtrabalhae").val();
			var utilizatrabalho  = $("select#utilizatrabalho").val();
			var distanciatrabalho	= $("select#distanciatrabalho").val();
            var ceppernoite	= $("input#ceppernoite").val();
			var enderecopernoite	= $("input#enderecopernoite").val();
			var comentarios	= $("textarea#comentarios").val();
            
            
            // End get values from other fields 
            $.ajax({
                url: "../formkit/mail/autos.php",
                type: "POST",
                data: {
                    nome: nome,
					endereco: endereco,
					numero: numero,
					complemento: complemento,
					cep: cep,
					cidade: cidade,
                    fone: fone,
                    email: email,
                    rg: rg, 
                    orgaoemissor: orgaoemissor, 
                    dataemissao: dataemissao,
                    cpf: cpf,
                    nascimento: nascimento,
                    sexo: sexo,
                    retornovia: retornovia,
					fabricante: fabricante,
                    modelo: modelo,
                    anofab: anofab,
                    anomodelo: anomodelo,
                    placa: placa,
                    chassi: chassi,
                    zerokm: zerokm,
                    alienacao: alienacao,
					antifurto: antifurto,
					tipoantifurto: tipoantifurto,
					temseguro: temseguro,
                    seguradora: seguradora,
                    classebonus: classebonus,
					vctoseguro: vctoseguro,
					regiaocircula: regiaocircula,
					utilizacao: utilizacao,
                    condsexo: condsexo,
                    condcpf: condcpf,
                    condestcivil: condestcivil,
                    condnasc: condnasc,
                    condprofissao: condprofissao,
                    condcnh: condcnh,
                    guardacasa: guardacasa,
                    guardatrabalho: guardatrabalho,
                    guardacolegio: guardacolegio,
                    residepessoa: residepessoa,
					residesexo: residesexo,
                    condtrabalhae: condtrabalhae,
					utilizatrabalho: utilizatrabalho, 
                    distanciatrabalho: distanciatrabalho,
                    ceppernoite: ceppernoite,
					enderecopernoite:enderecopernoite,
                    comentarios: comentarios
                },
                cache: false,
                success: function() {
					// Enable button & show success message
                    $("#btnenviar").attr("disabled", false);
					$('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<strong>Sua mensagem foi enviada com sucesso!</strong>");
                    $('#success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
					
                },
                error: function() {
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append("<strong>Lamentamos " + firstName + ", estamos passando por problemas técnicos, tente novamente mais tarde.");
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
            })
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

// When clicking on Full hide fail/success boxes
$('#nome').focus(function() {
    $('#success').html('');
});