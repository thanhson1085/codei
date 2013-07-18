<?php
class Hello extends CI_Controller
{
	function index()
	{
		echo 'Hello world!';
		log_message('debug', 'Hello world!');
	}
}
?>
