<?php
session_start();
include('config.php');

// Check if user is logged in and has admin privileges
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(['error' => 'Unauthorized access']);
    exit();
}

// Initialize response array
$response = [
    'totalUsers' => 0,
    'pendingApprovals' => 0,
    'recentActivity' => 0,
    'activityLabels' => [],
    'activityData' => [],
    'userTypes' => ['Admin', 'Regular', 'Pending'],
    'userCounts' => [0, 0, 0]
];

// Get total users count
$totalUsersQuery = "SELECT COUNT(*) as total FROM users";
$result = $conn->query($totalUsersQuery);
if ($result) {
    $row = $result->fetch_assoc();
    $response['totalUsers'] = $row['total'];
}

// Get pending approvals count
$pendingQuery = "SELECT COUNT(*) as pending FROM users WHERE status = 'pending'";
$result = $conn->query($pendingQuery);
if ($result) {
    $row = $result->fetch_assoc();
    $response['pendingApprovals'] = $row['pending'];
}

// Get recent activity (last 24 hours)
$recentActivityQuery = "SELECT COUNT(*) as recent FROM user_activity WHERE timestamp >= NOW() - INTERVAL 1 DAY";
$result = $conn->query($recentActivityQuery);
if ($result) {
    $row = $result->fetch_assoc();
    $response['recentActivity'] = $row['recent'];
}

// Get activity data for the last 7 days
$activityQuery = "
    SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count
    FROM 
        user_activity
    WHERE 
        timestamp >= NOW() - INTERVAL 7 DAY
    GROUP BY 
        DATE(timestamp)
    ORDER BY 
        date ASC
";

$result = $conn->query($activityQuery);
if ($result) {
    $activityData = [];
    $activityLabels = [];
    
    // Create array with all 7 days (even if no activity)
    for ($i = 6; $i >= 0; $i--) {
        $date = date('Y-m-d', strtotime("-$i days"));
        $activityLabels[] = date('M d', strtotime($date));
        $activityData[$date] = 0;
    }
    
    // Fill in actual data
    while ($row = $result->fetch_assoc()) {
        $activityData[$row['date']] = (int)$row['count'];
    }
    
    $response['activityLabels'] = $activityLabels;
    $response['activityData'] = array_values($activityData);
}

// Get user distribution by role
$userDistributionQuery = "
    SELECT 
        role,
        COUNT(*) as count
    FROM 
        users
    GROUP BY 
        role
";

$result = $conn->query($userDistributionQuery);
if ($result) {
    $adminCount = 0;
    $regularCount = 0;
    
    while ($row = $result->fetch_assoc()) {
        if ($row['role'] === 'admin') {
            $adminCount = (int)$row['count'];
        } else {
            $regularCount += (int)$row['count'];
        }
    }
    
    $response['userCounts'] = [
        $adminCount,
        $regularCount - $response['pendingApprovals'],
        $response['pendingApprovals']
    ];
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>