<?php
/**
 * Title: Checkout
 * Slug: start-stackable/template-page-checkout
 * Categories: pages
 * Template Types: page-checkout
 * Inserter: false
 */
?>

<!-- wp:template-part {"slug":"header-minimal","tagName":"header"} /-->

<!-- wp:woocommerce/page-content-wrapper {"page":"checkout"} -->
<!-- wp:group {"tagName":"main","align":"full","backgroundColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|xx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull has-base-background-color has-background" style="padding-top:var(--wp--preset--spacing--xx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:woocommerce/store-notices /-->

<!-- wp:post-content {"align":"wide","layout":{"type":"default"}} /--></main>
<!-- /wp:group -->
<!-- /wp:woocommerce/page-content-wrapper -->

<!-- wp:template-part {"slug":"footer-landing","tagName":"footer"} /-->
