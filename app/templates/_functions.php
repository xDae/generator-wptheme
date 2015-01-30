<?php
/**
* @package WordPress
* @subpackage <%= NombreTema %>
* @since <%= VersionTema %>
*/



/**
 * Initial theme setup and constants
 */
get_template_directory() . 'functions/init.php';


/**
 * Theme activation
 */
get_template_directory() . 'functions/activation.php';


/**
 * Scripts and stylesheets
 */
get_template_directory() . 'functions/scripts.php';


/**
 * Widget area list
 */
get_template_directory() . 'functions/widget-areas.php';


<% if ( CustomMetaboxes ) { %>/**
 * Inicializar los Custom Meta Boxes
 */
require_once 'lib/cmb2/init.php';
<% } %>

<% if ( ReduxFramework ) { %>/**
 * Inicializar los Custom Meta Boxes
 */
require_once 'lib/admin/admin-init.php';
<% } %>

<% if ( Plugins.length > 0 ) { %>/**
 * Incluir TGM_Plugin_Activation class.
 */
require_once 'lib/tgm-plugin-activation/plugin_dependencies.php';
<% } %>

