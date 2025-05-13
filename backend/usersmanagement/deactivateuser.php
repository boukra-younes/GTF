<?php
session_start();

include('../config.php');
include('../log_activity.php');

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

$stmt = $conn->prepare("UPDATE users SET status = 'pending' WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    // Log the deactivation activity
    logUserActivity($_SESSION['user']['id'], 'deactivate_user', 'Admin deactivated user ID: ' . $id);
    
    echo json_encode(["success" => true, "message" => "User deactivated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to deactivate user"]);
}

$conn->close();
?>