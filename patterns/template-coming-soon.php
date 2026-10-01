<?php
/**
 * Title: Coming Soon
 * Slug: start-stackable/template-coming-soon
 * Categories: pages
 * Template Types: coming-soon
 * Inserter: false
 */
?>

<!-- wp:woocommerce/coming-soon {"storeOnly":true,"className":"woocommerce-coming-soon-store-only"} -->
<div class="wp-block-woocommerce-coming-soon woocommerce-coming-soon-store-only"><!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","align":"full","backgroundColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull has-base-background-color has-background" style="padding-top:var(--wp--preset--spacing--xxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"backgroundColor":"tint","style":{"border":{"radius":"var:preset|border-radius|large"},"spacing":{"blockGap":"var:preset|spacing|medium","padding":{"top":"var:preset|spacing|xx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-tint-background-color has-background" style="border-radius:var(--wp--preset--border-radius--large);padding-top:var(--wp--preset--spacing--xx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:heading {"textAlign":"center","level":1,"fontSize":"xx-large"} -->
<h1 class="wp-block-heading has-text-align-center has-xx-large-font-size"><?php esc_html_e( 'Something good is taking shape.', 'start-stackable' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"medium"} -->
<p class="has-text-align-center has-medium-font-size"><?php esc_html_e( 'Our store is being prepared. Please check back soon.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /--></div>
<!-- /wp:woocommerce/coming-soon -->
