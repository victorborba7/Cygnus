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
    $planos = $_POST['planos'];
    $cpf = $_POST['cpf'];
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $cidade = $_POST['cidade'];
    $estado = $_POST['estado'];
    $fone = $_POST['fone'];
    $celular = $_POST['celular'];
    $retornovia = $_POST['retornovia'];
    $mensagem = $_POST['mensagem'];
    $de00a18 = $_POST['de00a18'];
	$de19a23 = $_POST['de19a23'];
	$de24a28 = $_POST['de24a28'];
	$de29a33 = $_POST['de29a33'];
	$de34a38 = $_POST['de34a38'];
	$de39a43 = $_POST['de39a43'];
	$de44a48 = $_POST['de44a48'];
	$de49a53 = $_POST['de49a53'];
	$de54a58 = $_POST['de54a58'];
	$de59a99 = $_POST['de59a99'];

// Create the email and send the message

$email_body = utf8_decode(
"Você recebeu uma cotação de seguros Saúde da Best Corretora de Seguros.\n
Estes são os detalhes:\n
PLANO: $planos\n
NOME: $nome\n
CPF/CNPJ: $cpf\n
EMAIL: $email\n
CIDADE: $cidade\n
ESTADO: $estado\n
TELEFONE: $fone\n
CELULAR: $celular\n
RETORNAR POR: $retornovia\n"

. "----------------------------------------------------------------------------\n\n" 
. "Quantidade de pessoas por faixa etária:\n
de00a18:$de00a18\n
de19a23:$de19a23\n
de24a28:$de24a28\n
de29a33:$de29a33\n
de34a38:$de34a38\n
de39a43:$de39a43\n
de44a48:$de44a48\n
de49a53:$de49a53\n
de54a58:$de54a58\n
de59a99:$de59a99\n"
. "----------------------------------------------------------------------------\n\n" 
. "COMENTÁRIOS:\n$mensagem\n"
. "----------------------------------------------------------------------------\n"
. "Fim da mensagem");

$to = 'claudio@bestseguros.com.br';
$replyto_email = "$email";
$from_email = "$email";
$email_subject = "[SAUDE]: Formulario de Cotacao";
$headers = "From: $from_email \n"; 
$headers .= "Reply-To: $replyto_email"; 
mail($to,$email_subject,$email_body,$headers,"-f$to");
return true;
?>