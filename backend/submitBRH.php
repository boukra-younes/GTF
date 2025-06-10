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

// Validate required fields
$required_fields = ['travail_id', 'volume_prevu', 'nbr_ouvriers', 
                   'moyens_materiel', 'volume_realise', 'volume_restant'];
foreach ($required_fields as $field) {
    if (!isset($input[$field])) {
        echo json_encode(["success" => false, "message" => "Missing required field: $field"]);
        exit();
    }
}

 // Validate numeric fields
if (!is_numeric($input['volume_prevu']) || $input['volume_prevu'] < 0) {
    echo json_encode(["success" => false, "message" => "Invalid volume prevu"]);
    exit();
}
if (!is_numeric($input['volume_realise']) || $input['volume_realise'] < 0) {
    echo json_encode(["success" => false, "message" => "Invalid volume realise"]);
    exit();
}
if (!is_numeric($input['volume_restant']) || $input['volume_restant'] < 0) {
    echo json_encode(["success" => false, "message" => "Invalid volume restant"]);
    exit();
}
if (!is_numeric($input['nbr_ouvriers']) || $input['nbr_ouvriers'] <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid nombre d'ouvriers"]);
    exit();
}

$agent_id = $_SESSION['user']['id'];

// Verify travail exists and is assigned to this agent
$travailQuery = $conn->prepare("SELECT id, titre, date_debut FROM travail WHERE id = ? AND agents_affectes_id = ? AND status = 'in_progress'");
if (!$travailQuery) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}

$travailQuery->bind_param("ii", $input['travail_id'], $agent_id);
$travailQuery->execute();
$travailResult = $travailQuery->get_result();
$travail = $travailResult->fetch_assoc();
$travailQuery->close();

if (!$travail) {
    echo json_encode(["success" => false, "message" => "Task not found or not assigned to you"]);
    exit();
}

// Calculate week number and year based on start date and current date
$start_date = new DateTime($travail['date_debut']);
$current_date = new DateTime();

// Calculate the difference in weeks
$interval = $current_date->diff($start_date);
$weeks = floor($interval->days / 7);
$week_number = $weeks + 1; // Add 1 to start from week 1

// Get the year based on the current date
$year = intval($current_date->format('Y'));

// Check if a BRH form already exists for this week
$checkQuery = $conn->prepare("SELECT id FROM brh_forms WHERE travail_id = ? AND agent_id = ? AND week_number = ? AND year = ?");
if (!$checkQuery) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}

$checkQuery->bind_param("iiii", $input['travail_id'], $agent_id, $week_number, $year);
$checkQuery->execute();
$checkResult = $checkQuery->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "A BRH form for this week has already been submitted"]);
    exit();
}
$checkQuery->close();

// Insert BRH form
$insertQuery = $conn->prepare("INSERT INTO brh_forms (travail_id, agent_id, week_number, year,
    volume_prevu, nbr_ouvriers, moyens_materiel, volume_realise, volume_restant, observation) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$insertQuery) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}

$observation = isset($input['observation']) ? $input['observation'] : '';
$insertQuery->bind_param("iiiiisddss", 
    $input['travail_id'],
    $agent_id,
    $week_number,
    $year,
    $input['volume_prevu'],
    $input['nbr_ouvriers'],
    $input['moyens_materiel'],
    $input['volume_realise'],
    $input['volume_restant'],
    $observation
);

try {
    if ($insertQuery->execute()) {
        // Log the activity
        $description = "Agent submitted BRH form for travail '{$travail['titre']}' (ID: {$travail['id']}) - Week {$week_number} of {$year}";
        logUserActivity($_SESSION['user']['id'], 'submit_brh', $description);

        echo json_encode([
            "success" => true,
            "message" => "BRH form submitted successfully",
            "week_number" => $week_number,
            "year" => $year
        ]);
    } else {
        throw new Exception($conn->error);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Failed to submit BRH form: " . $e->getMessage()]);
}

$insertQuery->close();
$conn->close();
?>