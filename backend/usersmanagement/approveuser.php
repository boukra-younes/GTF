<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include('../config.php');

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$id = $input['id'] ?? null;
if (!$id) {
    echo json_encode(["success" => false, "message" => "Missing user ID"]);
    exit();
}

$stmt = $conn->prepare("UPDATE users SET status = 'active' WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User approved successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to approve user"]);
}

$conn->close();
?> 