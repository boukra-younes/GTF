<?php
session_start();

include('config.php');
include('log_activity.php');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'responsable') {
    echo json_encode(["success" => false, "message" => "Unauthorized","rolee" => $_SESSION['user']['role']]);
    exit();
}

$id = $input['id'] ?? null;
if (!$id ) {
    echo json_encode(["success" => false, "message" => "Missing fields" , "id" => $id]);
    exit();
}

// Get user info before deletion for logging
$userInfoStmt = $conn->prepare("SELECT titre FROM travail WHERE id = ?");
$userInfoStmt->bind_param("i", $id);
$userInfoStmt->execute();
$userResult = $userInfoStmt->get_result();
$userInfo = $userResult->fetch_assoc();

$stmt = $conn->prepare("DELETE FROM travail WHERE id = ?");
$stmt->bind_param("i", $id); 

if ($stmt->execute()) {
    // Log the deletion activity with user details
    $description = 'Deleted Project: ' . ($id);
    logUserActivity($_SESSION['user']['id'], 'delete_user', $description);
    
    echo json_encode(["success" => true, "message" => " project Deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Delete failed"]);
}

$conn->close();
?>
