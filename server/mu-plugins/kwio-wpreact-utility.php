<?php
/**
 * @wordpress-plugin
 * Plugin Name:       WPreact Utility
 * Plugin URI:        https://github.com/wellmann/wpreact
 * Description:       Companion plugin to use WordPress as backend only.
 * Version:           0.1.0
 * Author:            Kevin Wellmann
 * Author URI:        http://kevin.wellmann.io
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 */

namespace KWIO\WPreact_Utility;

// Do not access file directly.
if (!defined('ABSPATH')) {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

function create_posttype() {
    register_post_type( 'product',
      array(
        'labels' => [
          'name' => 'Produkte',
          'singular_name' => 'Produkt'
        ],
        'public' => true,
        'rewrite' => [
            'slug' => 'products',
            'with_front' => false
        ],
      )
    );
  }
  add_action( 'init', 'KWIO\WPreact_Utility\create_posttype' );

// Alter permalink structure.
add_filter('page_link', 'KWIO\WPreact_Utility\link_filter', 1, 2);
add_filter('post_link', 'KWIO\WPreact_Utility\link_filter', 10, 2);
add_filter('post_type_link', 'KWIO\WPreact_Utility\link_filter', 10, 2);
function link_filter( $url, $post_or_id ) {
    if(!is_admin()){
        return;
    }

    return str_replace('/wp/index.php', '', $url);
}

// Disable frontend except API.
add_action('parse_request', function() {
    if(is_admin()) {
        return;
    }

    if(is_customize_preview()){
        return;
    }

    if(defined('REST_REQUEST') && REST_REQUEST) {
        return;
    }

    wp_redirect( site_url('wp-admin') );
    exit;
});

// Add links to admin bar
add_action('admin_bar_menu', function($wp_admin_bar) {
    $wp_host = 'http'.(is_ssl() ? 's' : '').'://'. $_SERVER['HTTP_HOST'];
    $meta_target = ['target' => 'blank'];

    $wp_admin_bar->add_node([
        'id' => 'site-name',
        'href' => $wp_host,
        'meta' => $meta_target
    ]);
    $wp_admin_bar->add_node([
        'id' => 'view-site',
        'href' => $wp_host,
        'meta' => $meta_target
    ]);
    $wp_admin_bar->add_node([
        'id' => 'view-json',
        'title' => 'JSON API',
        'parent' => 'site-name',
        'href' => get_rest_url(),
        'meta' => $meta_target
    ]);
}, 999);