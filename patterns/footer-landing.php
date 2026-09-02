<?php
/**
 * Title: Footer Landing
 * Slug: start-stackable/footer-landing
 * Categories: footer
 * Block Types: core/template-part/footer
 * Inserter: true
 */
?>

<!-- wp:group {"align":"full","backgroundColor":"tint","style":{"spacing":{"margin":{"top":"var:preset|spacing|x-large"},"padding":{"top":"var:preset|spacing|large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-tint-background-color has-background" style="margin-top:var(--wp--preset--spacing--x-large);padding-top:var(--wp--preset--spacing--large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|small"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">©</p>
<!-- /wp:paragraph -->

<!-- wp:site-title {"level":0,"fontSize":"small"} /--></div>
<!-- /wp:group -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><?php esc_html_e( 'Built with WordPress', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
