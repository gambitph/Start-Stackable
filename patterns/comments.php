<?php
/**
 * Title: Comments
 * Slug: start-stackable/comments
 * Categories: posts
 * Inserter: true
 */
?>

<!-- wp:comments {"style":{"spacing":{"margin":{"top":"var:preset|spacing|xx-large"}}}} -->
<div class="wp-block-comments" style="margin-top:var(--wp--preset--spacing--xx-large)"><!-- wp:heading {"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-x-large-font-size"><?php esc_html_e( 'Comments', 'start-stackable' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:comments-title {"level":3,"fontSize":"large"} /-->

<!-- wp:comment-template -->
<!-- wp:group {"style":{"border":{"bottom":{"color":"var:preset|color|outline","width":"1px"}},"spacing":{"padding":{"top":"var:preset|spacing|large","bottom":"var:preset|spacing|large"}}}} -->
<div class="wp-block-group" style="border-bottom-color:var(--wp--preset--color--outline);border-bottom-width:1px;padding-top:var(--wp--preset--spacing--large);padding-bottom:var(--wp--preset--spacing--large)"><!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:avatar {"size":48} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|small"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"},"fontSize":"small"} -->
<div class="wp-block-group has-small-font-size"><!-- wp:comment-author-name /-->

<!-- wp:comment-date /--></div>
<!-- /wp:group -->

<!-- wp:comment-content /-->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"},"fontSize":"small"} -->
<div class="wp-block-group has-small-font-size"><!-- wp:comment-edit-link /-->

<!-- wp:comment-reply-link /--></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:comment-template -->

<!-- wp:comments-pagination {"layout":{"type":"flex","justifyContent":"space-between"}} -->
<!-- wp:comments-pagination-previous /-->

<!-- wp:comments-pagination-numbers /-->

<!-- wp:comments-pagination-next /-->
<!-- /wp:comments-pagination -->

<!-- wp:post-comments-form /--></div>
<!-- /wp:comments -->
