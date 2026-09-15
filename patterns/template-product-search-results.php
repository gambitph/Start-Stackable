<?php
/**
 * Title: Product Search Results
 * Slug: start-stackable/template-product-search-results
 * Categories: posts
 * Template Types: product-search-results
 * Inserter: false
 */
?>

<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","align":"full","backgroundColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|xx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull has-base-background-color has-background" style="padding-top:var(--wp--preset--spacing--xx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|medium","margin":{"bottom":"var:preset|spacing|x-large"}}},"layout":{"type":"constrained","justifyContent":"left"}} -->
<div class="wp-block-group alignwide" style="margin-bottom:var(--wp--preset--spacing--x-large)"><!-- wp:woocommerce/breadcrumbs /-->

<!-- wp:query-title {"type":"search","showPrefix":false,"fontSize":"xx-large"} /-->

<!-- wp:woocommerce/store-notices /--></div>
<!-- /wp:group -->

<!-- wp:pattern {"slug":"start-stackable/product-collection"} /--></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
