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
            var email = $("input#email").val();
            var fone = $("input#fone").val();
            var retornovia = $("select#retornovia").val();
			var origem = $("input#origem"). val();
			var mensagem = $("textarea#mensagem").val();
            var firstName = nome; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = nome.split(' ').slice(0, -1).join(' ');
            }
            // START get values from other fields 
        
           
            // End get values from other fields 
            
            $.ajax({
                url: "../formkit/mail/seguros.php",
                type: "POST",
                data: {
                    nome: nome,
                    fone: fone,
                    email: email,
					retornovia: retornovia,
                    mensagem: mensagem,
					origem:origem
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