<?php
// Check for empty fields

if(empty($_POST['nome'])  ||
   empty($_POST['email']) ||
   empty($_POST['mensagem']) ||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "Sem argumentos!";
	return false;
   }
header('Content-Type: text/html;');
$nome = $_POST['nome'];
$email = $_POST['email'];
$fone = $_POST['fone'];
$mensagem = $_POST['mensagem'];
	
// Create the email and send the message

$email_body = utf8_decode("
Você recebeu uma mensagem de contato do site Best Corretora de Seguros.\n
Estes são os detalhes:\n
NOME: $nome\n
EMAIL: $email\n
FONE: $fone\n
MENSAGEM:\n
$mensagem
");

$to = 'claudio@bestseguros.com.br';
$replyto_email = "$email";
$from_email = "$email";
$email_subject = "[CONTATO]:  Formulario de Contato";
$headers = utf8_decode("From: $nome <$email> \n");
$headers .= "Reply-To: $email";	
mail($to,$email_subject,$email_body,$headers,"-f$to");
return true;			
?>
