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
            var firstName = nome; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = nome.split(' ').slice(0, -1).join(' ');
            }
            // START get values from other fields
			var planos = $("select#planos").val();
            var cpf = $("input#cpf").val();
			var cidade = $("input#cidade").val();
			var estado = $("select#estado").val();
			var email = $("input#email").val();
            var fone = $("input#fone").val();
            var celular= $("input#celular").val();
			var retornovia = $("select#retornovia").val();
			var de00a18 = $("input#de00a18").val();
			var de19a23 = $("input#de19a23").val();
			var de24a28 = $("input#de24a28").val();
			var de29a33 = $("input#de29a33").val();
			var de34a38 = $("input#de34a38").val();
			var de39a43 = $("input#de39a43").val();
			var de44a48 = $("input#de44a48").val();
			var de49a53 = $("input#de49a53").val();
			var de54a58 = $("input#de54a58").val();
			var de59a99 = $("input#de59a99").val();
            var mensagem = $("textarea#mensagem").val();
			 
		// End get values from other fields 
            
            $.ajax({
                url: "../formkit/mail/saude.php",
                type: "POST",
                data: {
					planos: planos,
                    nome: nome,
					cpf: cpf,
                    cidade: cidade,
					estado: estado,
					email: email,
					fone: fone,
					celular: celular,
					retornovia: retornovia,
                    mensagem: mensagem,
        de00a18:de00a18,
		de19a23:de19a23,
	    de24a28:de24a28,
		de29a33:de29a33,
		de34a38:de34a38,
		de39a43:de39a43,
		de44a48:de44a48,
		de49a53:de49a53,
		de54a58:de54a58,
		de59a99:de59a99
                    
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
