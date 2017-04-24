<?php
$name = $_POST["name"];
$email = $_POST["email"];
$topic = $_POST["topic"];
$message = $_POST["message"];

// YOU ONLY NEED TO MODIFY THIS TWO VARIABLES
// WITH YOUR MAIL ACCOUNT AND CUSTOMIZE YOUR
// SUBJECT ONCE THE MAIL ARRIVES TO YOUR INBOX
$EmailTo = "yourmailhere@gmail.com";
$Subject = "New Message Received from your Website!";
 
// prepare email body text
$Body .= "Name: ";
$Body .= $name;
$Body .= "\n";
 
$Body .= "Email: ";
$Body .= $email;
$Body .= "\n";

$Body .= "Topic: ";
$Body .= $topic;
$Body .= "\n";
 
$Body .= "Message: ";
$Body .= $message;
$Body .= "\n";
 
// send email
$success = mail($EmailTo, $Subject, $Body, "From:".$email);
 
// redirect to success page
if ($success){
   echo "success";
}else{
    echo "invalid";
}
 
?>