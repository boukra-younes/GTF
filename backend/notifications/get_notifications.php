<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include('../config.php');

if (!isset($_SESSION['user'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$userId = $_SESSION['user']['id'];

// Get unread notifications
$stmt = $conn->prepare("
    SELECT id, message, created_at, is_read 
    FROM notifications 
    WHERE user_id = ? 
    ORDER BY created_at DESC
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = [
        'id' => $row['id'],
        'message' => $row['message'],
        'created_at' => $row['created_at'],
        'is_read' => (bool)$row['is_read']
    ];
}

echo json_encode($notifications);

$conn->close();
?> 