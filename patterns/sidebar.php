<?php
/**
 * Title: Sidebar
 * Slug: start-stackable/sidebar
 * Categories: pages
 * Inserter: false
 */
?>

<!-- wp:group {"backgroundColor":"tint","style":{"border":{"radius":"var:preset|border-radius|large"},"spacing":{"blockGap":"var:preset|spacing|large","padding":{"top":"var:preset|spacing|large","right":"var:preset|spacing|large","bottom":"var:preset|spacing|large","left":"var:preset|spacing|large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-tint-background-color has-background" style="border-radius:var(--wp--preset--border-radius--large);padding-top:var(--wp--preset--spacing--large);padding-right:var(--wp--preset--spacing--large);padding-bottom:var(--wp--preset--spacing--large);padding-left:var(--wp--preset--spacing--large)"><!-- wp:search {"label":"<?php echo esc_attr_x( 'Search', 'Sidebar search label', 'start-stackable' ); ?>","showLabel":false,"placeholder":"<?php echo esc_attr_x( 'Search the site', 'Sidebar search placeholder', 'start-stackable' ); ?>","buttonUseIcon":true} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|medium"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":2,"fontSize":"medium"} -->
<h2 class="wp-block-heading has-medium-font-size"><?php esc_html_e( 'Latest posts', 'start-stackable' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:latest-posts {"displayPostDate":true,"fontSize":"small"} /--></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|medium"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":2,"fontSize":"medium"} -->
<h2 class="wp-block-heading has-medium-font-size"><?php esc_html_e( 'Categories', 'start-stackable' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:categories {"showPostCounts":true,"fontSize":"small"} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
