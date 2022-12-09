<?php
// Check for empty fields

if(empty($_POST['nome'])  ||
   empty($_POST['email']) ||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "Sem argumentos!";
	return false;
   }
	header('Content-Type: text/html; charset=utf-8');
    $nome       = $_POST['nome'];
    $email      = $_POST['email'];
    $fone       = $_POST['fone'];
    $retornovia = $_POST['retornovia'];
    $mensagem   = $_POST['mensagem'];
    $origem     = $_POST['origem'];

// Create the email and send the message

$email_body = utf8_decode(
"Você recebeu uma cotação de Seguro ".$origem." da Best Corretora de Seguros.\n
Estes são os detalhes:\n
NOME: $nome\n
EMAIL: $email\n
TELEFONE: $fone\n
RETORNAR POR: $retornovia\n"

."----------------------------------------------------------------------------\n\n" 
. "COMENTÁRIOS:\n$mensagem\n"
. "----------------------------------------------------------------------------\n"
. "Fim da mensagem");

$to = 'claudio@bestseguros.com.br';
$replyto_email = "$email";
$from_email    = "$email";
$email_subject = "[SEGUROS]: Formulario de Cotacao";
$headers       = utf8_decode("From: $from_email \n"); 
$headers      .= "Reply-To: $replyto_email"; 
mail($to,$email_subject,$email_body,$headers,"-f$to");
return true;
?>
