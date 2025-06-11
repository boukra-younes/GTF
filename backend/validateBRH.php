



<?php
session_start();
include('config.php');
include('notifications/create_notification.php');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

$input = json_decode(file_get_contents("php://input"), true);
$brh_id = $input['brh_id'] ?? null;
$status = $input['status'] ?? null; // 'accepted' or 'refused'
$message = $input['message'] ?? '';

if (!$brh_id || !$status) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

// Get BRH and travail information
$query = $conn->prepare("SELECT b.*, t.titre, t.responsable_id FROM brh_forms b 
JOIN travail t ON b.travail_id = t.id 
WHERE b.id = ? AND t.responsable_id = ?");
$query->bind_param("ii", $brh_id, $_SESSION['user']['id']);
$query->execute();
$result = $query->get_result();
$brh = $result->fetch_assoc();

if (!$brh) {
    echo json_encode(["success" => false, "message" => "BRH not found or unauthorized"]);
    exit();
}

// Update BRH status
$updateQuery = $conn->prepare("UPDATE brh_forms SET statusR = ? WHERE id = ?");
$updateQuery->bind_param("si", $status, $brh_id);

if ($updateQuery->execute()) {
    // Send notification to agent
    $notificationMessage = $status === 'accepted' 
        ? "Your BRH report for '{$brh['titre']}' has been accepted" 
        : "Your BRH report for '{$brh['titre']}' has been refused. Reason: $message. Please submit a new report.";
    
    createNotification($brh['agent_id'], $notificationMessage);
    
    echo json_encode(["success" => true, "message" => "BRH status updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update BRH status"]);
}