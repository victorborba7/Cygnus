<?php

// Check for empty fields
// return true;

if(empty($_POST['nome'])  ||
   empty($_POST['email']) ||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "Sem argumentos!";
	return false;
   }
	header('Content-Type: text/html; charset=utf-8');
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $fone = $_POST['fone'];
    $cidade = $_POST['cidade'];
    $cpf = $_POST['cpf'];
    $nascimento = $_POST['nascimento'];
    $retornovia = $_POST['retornovia'];
    
    $fabricante = $_POST['fabricante'];
    $modelo = $_POST['modelo'];
    $anofab = $_POST['anofab'];
    $anomodelo = $_POST['anomodelo'];
    $placa = $_POST['placa'];
    $chassi = $_POST['chassi'];
    $zerokm = $_POST['zerokm'];
    $alienacao = $_POST['alienacao'];
    $antifurto = $_POST['antifurto'];
    $tipoantifurto = $_POST['tipoantifurto'];
    
    $temseguro = $_POST['temseguro'];
    $seguradora = $_POST['seguradora'];
    $classebonus = $_POST['classebonus'];
    $vctoseguro = $_POST['vctoseguro'];
    $regiaocircula = $_POST['regiaocircula'];
    $utilizacao = $_POST['utilizacao'];
    
    $condsexo = $_POST['condsexo'];
    $condcpf = $_POST['condcpf'];
    $condestcivil = $_POST['condestcivil'];
    $condnasc = $_POST['condnasc'];
    $condprofissao = $_POST['condprofissao'];
    
    $guardacasa = $_POST['guardacasa'];
    $guardatrabalho = $_POST['guardatrabalho'];
    $guardacolegio = $_POST['guardacolegio'];
    $residepessoa = $_POST['residepessoa'];
    $residesexo = $_POST['residesexo'];
    $condtrabalhae = $_POST['condtrabalhae'];
    $utilizatrabalho = $_POST['utilizatrabalho'];
    $distanciatrabalho = $_POST['distanciatrabalho'];
    $ceppernoite = $_POST['ceppernoite'];
    $enderecopernoite = $_POST['enderecopernoite'];
    $comentarios = $_POST['comentarios'];


    
// Create the email and send the message
$email_body = utf8_decode(
"Você recebeu uma cotação de seguro auto do Site Best Corretora de Seguros.\n
Estes são os detalhes:\n
NOME: $nome\n
EMAIL: $email\n
TELEFONE: $fone\n
CIDADE/ESTADO: $cidade\n
CPF/CNPJ: $cpf\n
NASCIMENTO: $nascimento\n
RETORNO POR: $retornovia\n"
. 
"-------------------------------------------------------------------------\n\n"
. "Sobre o veículo:\n
FABRICANTE: $fabricante\n
MODELO: $modelo\n
ANO DE FABRICAÇÃO: $anofab\n
ANO MODELO: $anomodelo\n
PLACA: $placa\n
NÚMERO DO CHASSI: $chassi\n
ZERO KM?: $zerokm\n
ALIENAÇÃO: $alienacao\n
TEM ANTIFURTO: $antifurto\n
TIPO DE ANTIFURTO: $tipoantifurto\n"
. 
"-------------------------------------------------------------------------\n\n"
. "Sobre o seguro:\n
JÁ TEM SEGURO? $temseguro\n
EMPRESA SEGURADORA: $seguradora\n
CLASSE DE BÔNUS: $classebonus\n
DATA DE VENCIMENTO DO SEGURO: $vctoseguro\n
REGIÃO DE CIRCULAÇÃO: $regiaocircula\n
UTILIZAÇÃO: $utilizacao\n"	
. "-------------------------------------------------------------------------\n"
. "Sobre o condutor Principal:\n
SEXO: $condsexo\n
CPF: $condcpf\n
ESTADO CIVIL: $condestcivil\n
Data de nascimento: $condnasc\n
PROFISSÃO: $condprofissao\n"
. "-------------------------------------------------------------------------\n
Pussui garagem ou estacionamento fechado\n"
."NA RESIDENCIA: $gardacasa\n
NO TRABALHO: $guardatrabalho\n
NO COLÉGIO/FACULDADE/PÓS: $guardacolegio\n
TRABALHA E RESIDE: $condtrabalhae\n
RESIDE PESSOAS ENTRE 18/25 ANOS: $residepessoa\n
SEXO DA PESSOA: $residesexo\n
RESIDE E TRABALHA: $condtrabalhae\n
DISTANCIA DE CASA AO TRABALHO: $distanciatrabalho\n
CEP PERNOITE: $ceppernoite\n
ENDEREÇO PERNOITE: $enderecopernoite\n"
. "-------------------------------------------------------------------------\n\n"

. "COMENTÁRIOS:\n$comentarios\n"
. "-------------------------------------------------------------------------\n". "Fim da mensagem");

$to = 'claudio@bestseguros.com.br';
$replyto_email = "$email";
$from_email = "$email";
$email_subject = "[SEGURO AUTO]: Formulario de Cotacao";
$headers = utf8_decode("From: $from_email \n"); 
$headers .= "Reply-To: $replyto_email"; 
mail($to,$email_subject,$email_body,$headers,"-f$to");
return true;
?>
