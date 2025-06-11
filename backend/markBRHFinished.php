<?php
session_start();
include('config.php');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'agent') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$brh_id = $input['brh_id'] ?? null;

if (!$brh_id) {
    echo json_encode(["success" => false, "message" => "Missing BRH ID"]);
    exit();
}

$updateQuery = $conn->prepare("UPDATE brh_forms SET statusA = 'finished' WHERE travail_id = ? AND agent_id = ?");
$updateQuery->bind_param("ii", $brh_id, $_SESSION['user']['id']);

if ($updateQuery->execute()) {
    echo json_encode(["success" => true, "message" => "BRH marked as finished"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update BRH status"]);
}