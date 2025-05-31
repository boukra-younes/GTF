<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include('config.php');

// Join users with agents to get agent-specific status
$query = "
    SELECT 
        users.iduser,
        users.fname,
        users.email,
        users.status AS user_status,
        agents.status AS agent_status
    FROM 
        users
    INNER JOIN 
        agents ON users.iduser = agents.user_id
    WHERE 
        users.role = 'agent'
";

$stmt = $conn->prepare($query);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare SELECT statement"]);
    exit();
}

$stmt->execute();
$result = $stmt->get_result();

$agents = [];
while ($row = $result->fetch_assoc()) {
    $agents[] = $row;
}

echo json_encode($agents);

$conn->close();
?>
