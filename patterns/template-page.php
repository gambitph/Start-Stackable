<?php
/**
 * Title: Page
 * Slug: start-stackable/template-page
 * Categories: pages
 * Template Types: page
 * Inserter: false
 */
?>

<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|xx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--xx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:post-title {"level":1,"fontSize":"xx-large"} /-->

<!-- wp:post-featured-image {"align":"wide","style":{"border":{"radius":"var:preset|border-radius|large"},"spacing":{"margin":{"bottom":"var:preset|spacing|x-large"}}}} /-->

<!-- wp:post-content {"align":"full","style":{"spacing":{"padding":{"right":"var:preset|spacing|xx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} /--></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
