<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include('../config.php');

if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$notificationId = $input['id'] ?? null;

if (!$notificationId) {
    echo json_encode(["success" => false, "message" => "Missing notification ID"]);
    exit();
}

// Verify the notification belongs to the current user
$stmt = $conn->prepare("SELECT id FROM notifications WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $notificationId, $_SESSION['user']['id']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Notification not found or unauthorized"]);
    exit();
}

// Mark as read
$stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
$stmt->bind_param("i", $notificationId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Notification marked as read"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to mark notification as read"]);
}

$conn->close();
?> 