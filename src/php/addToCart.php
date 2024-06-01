<?php
// Start session if not already started
session_start();

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define a function to log messages
function log_message($message) {
    $log_file = '/var/www/html/php/logs/addToCart.log';
    $log_dir = dirname($log_file);
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0777, true);
    }
    if (!file_exists($log_file)) {
        file_put_contents($log_file, '');
        chmod($log_file, 0666);
    }
    error_log($message, 3, $log_file);
}

// Function to establish database connection
function connectToDatabase() {
    $servername = "db"; 
    $username = "user"; 
    $password = "user"; 
    $database = "shop"; 

    // Create connection
    $conn = new mysqli($servername, $username, $password, $database);

    // Check connection
    if ($conn->connect_error) {
        log_message("Connection failed: " . $conn->connect_error . "\n");
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}

// Function to create database table
function createDatabaseAndTable() {
    $conn = connectToDatabase();

    // Create table
    $sql = "CREATE TABLE IF NOT EXISTS cart (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_id INT(6) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_price DECIMAL(10, 2) NOT NULL,
        quantity INT(6) NOT NULL DEFAULT 1
    )";

    if ($conn->query($sql) === TRUE) {
        log_message("Table cart created successfully\n");
    } else {
        log_message("Error creating table: " . $conn->error . "\n");
    }

    // Close connection
    $conn->close();
}

// Function to add item to database cart
function addToCart($id, $name, $price) {
    $conn = connectToDatabase();

    // Prepare SQL statement to check if item exists in cart
    $stmt = $conn->prepare("SELECT * FROM cart WHERE product_id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    // If item exists, update quantity
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $quantity = $row['quantity'] + 1;

        // Update quantity in cart
        $stmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE product_id = ?");
        $stmt->bind_param("ii", $quantity, $id);
        $stmt->execute();
        log_message("Updated quantity for product_id $id\n");
    } else {
        // If item does not exist, insert new item into cart
        $stmt = $conn->prepare("INSERT INTO cart (product_id, product_name, product_price, quantity) VALUES (?, ?, ?, 1)");
        $stmt->bind_param("iss", $id, $name, $price);
        $stmt->execute();
        log_message("Inserted product_id $id, name $name, price $price into cart\n");
    }

    // Close prepared statement and connection
    $stmt->close();
    $conn->close();

    return true;
}

// Create database and table
createDatabaseAndTable();

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve posted data
    $postData = json_decode(file_get_contents('php://input'), true);

    // Log posted data
    log_message("Posted data: " . print_r($postData, true) . "\n");

    // Validate if required data is present
    if (isset($postData['id']) && isset($postData['name']) && isset($postData['price'])) {
        // Sanitize input data
        $id = intval($postData['id']);
        $name = htmlspecialchars($postData['name']);
        $price = floatval($postData['price']);

        // Add item to database cart
        if (addToCart($id, $name, $price)) {
            // Respond with success message
            echo json_encode(array('success' => true));
        } else {
            // Respond with error message
            echo json_encode(array('error' => 'Failed to add item to cart'));
        }
    } else {
        // Respond with error message if required data is missing
        echo json_encode(array('error' => 'Missing data'));
    }
} else {
    // Respond with error message if request method is not POST
    echo json_encode(array('error' => 'Method not allowed'));
}
?>