<?php
session_start();
include('config.php');
include('log_activity.php');

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Check if user is logged in and has agent role
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'agent') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// Get input data
$input = json_decode(file_get_contents("php://input"), true);

$travail_id = isset($input['id']) ? intval($input['id']) : null;

if (!$travail_id) {
    echo json_encode(["success" => false, "message" => "Missing travail ID"]);
    exit();
}

// Verify travail exists and is assigned to this agent
$travailQuery = $conn->prepare("SELECT id, titre, date_debut FROM travail WHERE id = ? AND agents_affectes_id = ? AND status != 'completed'");
if (!$travailQuery) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}
$agent_id = $_SESSION['user']['id'];
$travailQuery->bind_param("ii", $travail_id, $agent_id);
$travailQuery->execute();
$travailResult = $travailQuery->get_result();
$travail = $travailResult->fetch_assoc();
$travailQuery->close();

if (!$travail) {
    echo json_encode(["success" => false, "message" => "Task not found or already completed"]);
    exit();
}

// Calculate how many weeks the task has been active
$start_date = new DateTime($travail['date_debut']);
$current_date = new DateTime();
$interval = $start_date->diff($current_date);
$weeks_active = ceil($interval->days / 7);

// Check if there are BRH reports for each week
$brh_query = $conn->prepare("SELECT COUNT(*) as report_count FROM brh_reports WHERE travail_id = ? AND agent_id = ?");
$brh_query->bind_param("ii", $travail_id, $agent_id);
$brh_query->execute();
$brh_result = $brh_query->get_result();
$brh_count = $brh_result->fetch_assoc()['report_count'];
$brh_query->close();

if ($brh_count < $weeks_active) {
    echo json_encode(["success" => false, "message" => "You must submit a BRH report for each week before completing the task"]);
    exit();
}

// Update the travail status to completed
$updateQuery = $conn->prepare("UPDATE travail SET status = 'completed' WHERE id = ?");
if (!$updateQuery) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}

$updateQuery->bind_param("i", $travail_id);

if ($updateQuery->execute()) {
    // Update agent status to free
    $updateAgentQuery = $conn->prepare("UPDATE agents SET status = 'free' WHERE agent_id = ?");
    if (!$updateAgentQuery) {
        echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
        exit();
    }
    
    $updateAgentQuery->bind_param("i", $agent_id);
    $updateAgentQuery->execute();
    $updateAgentQuery->close();
    
    // Log the activity
    $description = "Agent marked travail '{$travail['titre']}' (ID: {$travail_id}) as completed";
    logUserActivity($_SESSION['user']['id'], 'complete_task', $description);

    echo json_encode([
        "success" => true,
        "message" => "Task successfully marked as completed",
        "travail_title" => $travail['titre']
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update task: " . $conn->error]);
}

$updateQuery->close();
$conn->close();
?>