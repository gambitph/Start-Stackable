<?php
/**
 * Title: Order Confirmation
 * Slug: start-stackable/template-order-confirmation
 * Categories: pages
 * Template Types: order-confirmation
 * Inserter: false
 */
?>

<!-- wp:template-part {"slug":"header-minimal","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","align":"full","backgroundColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|xx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull has-base-background-color has-background" style="padding-top:var(--wp--preset--spacing--xx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|x-large"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide"><!-- wp:woocommerce/order-confirmation-status {"fontSize":"large"} /-->

<!-- wp:woocommerce/order-confirmation-summary /-->

<!-- wp:woocommerce/order-confirmation-totals-wrapper {"align":"wide"} -->
<!-- wp:pattern {"slug":"woocommerce/order-confirmation-totals-heading"} /-->

<!-- wp:woocommerce/order-confirmation-totals {"lock":{"remove":true}} /-->
<!-- /wp:woocommerce/order-confirmation-totals-wrapper -->

<!-- wp:woocommerce/order-confirmation-downloads-wrapper {"align":"wide"} -->
<!-- wp:pattern {"slug":"woocommerce/order-confirmation-downloads-heading"} /-->

<!-- wp:woocommerce/order-confirmation-downloads {"lock":{"remove":true}} /-->
<!-- /wp:woocommerce/order-confirmation-downloads-wrapper -->

<!-- wp:columns {"align":"wide","className":"wc-block-order-confirmation-address-wrapper"} -->
<div class="wp-block-columns alignwide wc-block-order-confirmation-address-wrapper"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:woocommerce/order-confirmation-shipping-wrapper {"align":"wide"} -->
<!-- wp:pattern {"slug":"woocommerce/order-confirmation-shipping-heading"} /-->

<!-- wp:woocommerce/order-confirmation-shipping-address {"lock":{"remove":true}} /-->
<!-- /wp:woocommerce/order-confirmation-shipping-wrapper --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:woocommerce/order-confirmation-billing-wrapper {"align":"wide"} -->
<!-- wp:pattern {"slug":"woocommerce/order-confirmation-billing-heading"} /-->

<!-- wp:woocommerce/order-confirmation-billing-address {"lock":{"remove":true}} /-->
<!-- /wp:woocommerce/order-confirmation-billing-wrapper --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:woocommerce/order-confirmation-additional-fields-wrapper {"align":"wide"} -->
<!-- wp:pattern {"slug":"woocommerce/order-confirmation-additional-fields-heading"} /-->

<!-- wp:woocommerce/order-confirmation-additional-fields /-->
<!-- /wp:woocommerce/order-confirmation-additional-fields-wrapper -->

<!-- wp:woocommerce/order-confirmation-additional-information /--></div>
<!-- /wp:group --></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer-landing","tagName":"footer"} /-->
