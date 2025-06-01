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

// Check if user is logged in and has responsable role
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'responsable') {
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

$travail_id = isset($input['travailId']) ? intval($input['travailId']) : null;
$agent_id = isset($input['selectedAgent']) ? intval($input['selectedAgent']) : null;

if (!$travail_id || !$agent_id) {
    echo json_encode(["success" => false, "message" => "Missing travail ID or agent ID"]);
    exit();
}

// Verify agent exists and has agent role
$agentQuery = $conn->prepare("SELECT id, fname, email FROM users WHERE id = ? AND role = 'agent' AND status = 'active'");
if (!$agentQuery) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}
$agentQuery->bind_param("i", $agent_id);
$agentQuery->execute();
$agentResult = $agentQuery->get_result();
$agent = $agentResult->fetch_assoc();
$agentQuery->close();

if (!$agent) {
    echo json_encode(["success" => false, "message" => "Invalid or inactive agent"]);
    exit();
}

// Check if agent is already assigned to another travail
$checkAssignmentQuery = $conn->prepare("SELECT id FROM travail WHERE agents_affectes_id = ? AND status != 'completed'");
if (!$checkAssignmentQuery) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}
$checkAssignmentQuery->bind_param("i", $agent_id);
$checkAssignmentQuery->execute();
$assignmentResult = $checkAssignmentQuery->get_result();

if ($assignmentResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Agent is already assigned to another active travail"]);
    exit();
}
$checkAssignmentQuery->close();

// Verify travail exists and is not already assigned
$travailQuery = $conn->prepare("SELECT titre, agents_affectes_id FROM travail WHERE id = ? AND status != 'completed'");
if (!$travailQuery) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}
$travailQuery->bind_param("i", $travail_id);
$travailQuery->execute();
$travailResult = $travailQuery->get_result();
$travail = $travailResult->fetch_assoc();
$travailQuery->close();

if (!$travail) {
    echo json_encode(["success" => false, "message" => "Travail not found or already completed"]);
    exit();
}

if ($travail['agents_affectes_id']) {
    echo json_encode(["success" => false, "message" => "Travail is already assigned to an agent"]);
    exit();
}

// Update the travail to assign the agent
$updateQuery = $conn->prepare("UPDATE travail SET agents_affectes_id = ?, status = 'in_progress' WHERE id = ?");
if (!$updateQuery) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}

$updateQuery->bind_param("ii", $agent_id, $travail_id);

if ($updateQuery->execute()) {
    // Log the activity
    $description = "Assigned agent {$agent['fname']} ({$agent['email']}) to travail '{$travail['titre']}' (ID: {$travail_id})";
    logUserActivity($_SESSION['user']['id'], 'assign_agent', $description);

    echo json_encode([
        "success" => true,
        "message" => "Agent successfully assigned to travail",
        "agent_name" => $agent['fname'],
        "travail_title" => $travail['titre']
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to assign agent: " . $conn->error]);
}

$updateQuery->close();
$conn->close();
?>