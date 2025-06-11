<?php
session_start();
include('config.php');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'responsable') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$query = $conn->prepare("SELECT b.*, t.titre, t.description, u.fname as agent_name 
FROM brh_forms b 
JOIN travail t ON b.travail_id = t.id 
JOIN users u ON b.agent_id = u.id 
WHERE t.responsable_id = ? 
ORDER BY b.created_at DESC");

$query->bind_param("i", $_SESSION['user']['id']);
$query->execute();
$result = $query->get_result();

$brh_reports = [];
while ($row = $result->fetch_assoc()) {
    $brh_reports[] = $row;
}

echo json_encode(["success" => true, "data" => $brh_reports]);