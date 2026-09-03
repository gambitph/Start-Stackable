<?php
/**
 * Title: Page Not Found
 * Slug: start-stackable/template-404
 * Categories: posts
 * Template Types: 404
 * Inserter: false
 */
?>

<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","align":"full","style":{"dimensions":{"minHeight":"60vh"},"spacing":{"padding":{"top":"var:preset|spacing|xx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull" style="min-height:60vh;padding-top:var(--wp--preset--spacing--xx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|large"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"align":"center","textColor":"primary-deep","fontSize":"small"} -->
<p class="has-text-align-center has-primary-deep-color has-text-color has-small-font-size"><?php esc_html_e( 'Error 404', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","level":1,"fontSize":"xx-large"} -->
<h1 class="wp-block-heading has-text-align-center has-xx-large-font-size"><?php esc_html_e( 'Page not found', 'start-stackable' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","textColor":"contrast-accent"} -->
<p class="has-text-align-center has-contrast-accent-color has-text-color"><?php esc_html_e( 'The page may have moved or no longer exists. Try searching the site instead.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:search {"label":"<?php echo esc_attr_x( 'Search', 'Search form label', 'start-stackable' ); ?>","showLabel":false,"placeholder":"<?php echo esc_attr_x( 'Search the site', 'Search form placeholder', 'start-stackable' ); ?>","buttonText":"<?php echo esc_attr_x( 'Search', 'Search form button', 'start-stackable' ); ?>","buttonUseIcon":true,"width":75,"widthUnit":"%","align":"center"} /--></div>
<!-- /wp:group --></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
