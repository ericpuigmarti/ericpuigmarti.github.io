<?php
$email = $_POST["email"];

// YOU ONLY NEED TO MODIFY THIS TWO VARIABLES
// WITH YOUR MAIL ACCOUNT AND CUSTOMIZE YOUR
// SUBJECT ONCE THE MAIL ARRIVES TO YOUR INBOX
$EmailTo = "yourmailhere@gmail.com";
$Subject = "New Subscriber from your Website!";
 
// prepare email body text
$Body .= "Subscriber mail: ";
$Body .= $email;
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