<?php

// Função para verificar se a solicitação é do mesmo domínio
function isSameDomain() {
    if (!isset($_SERVER['HTTP_REFERER'])) {
        return false; // Referer não definido, potencial problema de segurança
    }
    $refererHost = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);
    $serverHost = $_SERVER['SERVER_NAME'];
    return $refererHost === $serverHost;
}

// Configure CORS para aceitar apenas requisições dos seus domínios
$allowedOrigins = ['https://espiaoinvisivel.com','https://espiaoinvisivel.com','https://espiaoinvisivel.com.br','https://espiaodetetive.com','https://espiaoculto.com','https://monitorefacil.com','https://espiaodetector.com']; // Substitua pelos seus domínios
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
} else {
    http_response_code(403); // Proibido
    echo json_encode(['error' => 'Origem não permitida.']);
    exit;
}

// Verifica se a solicitação é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Método não permitido
    echo json_encode(['error' => 'Apenas requisições POST são aceitas.']);
    exit;
}

// Verifica se a solicitação veio do mesmo domínio
if (!isSameDomain()) {
    http_response_code(403); // Proibido
    echo json_encode(['error' => 'Acesso negado. Solicitação de origem não permitida.']);
    exit;
}

// Define o cabeçalho para JSON
header('Content-Type: application/json');

// Recebe e decodifica o JSON enviado
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// Verifica se o campo 'phone' está presente no JSON
if (!isset($input['phone'])) {
    http_response_code(400); // Requisição inválida
    echo json_encode(['error' => 'Campo "phone" é obrigatório.']);
    exit;
}

// Sanitiza o número de telefone
$phone = filter_var($input['phone'], FILTER_SANITIZE_STRING);
$phone = preg_replace('/[^0-9]/', '', $phone); // Remove caracteres não numéricos

if (empty($phone) || strlen($phone) < 10) { // Verificação básica de comprimento
    http_response_code(400); // Requisição inválida
    echo json_encode(['error' => 'Número de telefone inválido.']);
    exit;
}

// Inicializa o cURL
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://whatsapp-data1.p.rapidapi.com/number/$phone",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => [
        "x-rapidapi-host: whatsapp-data1.p.rapidapi.com",
        "x-rapidapi-key: 4f9decdf1cmsha8e3c875cf114cfp10297fjsnf1451941f64f"
    ],
]);

// Executa o cURL
$response = curl_exec($curl);
$err = curl_error($curl);

// Fecha o cURL
curl_close($curl);

// Verifica erros no cURL
if ($err) {
    http_response_code(500); // Erro interno
    echo json_encode(['error' => "Erro cURL: $err"]);
} else {
    // Retorna a resposta da API
    echo $response;
}
?>
