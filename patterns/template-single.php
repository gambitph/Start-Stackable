<?php
/**
 * Title: Single Post
 * Slug: start-stackable/template-single
 * Categories: posts
 * Template Types: single
 * Inserter: false
 */
?>

<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|xx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--xx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|medium"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:post-terms {"term":"category"} /-->

<!-- wp:post-title {"level":1,"fontSize":"xx-large"} /-->

<!-- wp:pattern {"slug":"start-stackable/post-meta"} /--></div>
<!-- /wp:group -->

<!-- wp:post-featured-image {"align":"wide","aspectRatio":"16/9","style":{"border":{"radius":"var:preset|border-radius|large"},"spacing":{"margin":{"top":"var:preset|spacing|x-large","bottom":"var:preset|spacing|x-large"}}}} /-->

<!-- wp:post-content {"align":"full","style":{"spacing":{"padding":{"right":"var:preset|spacing|xx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} /-->

<!-- wp:separator {"className":"is-style-wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|large"}}}} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide" style="margin-top:var(--wp--preset--spacing--xx-large);margin-bottom:var(--wp--preset--spacing--large)"/>
<!-- /wp:separator -->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group"><!-- wp:post-navigation-link {"type":"previous","label":"<?php echo esc_attr_x( 'Previous post', 'Post navigation label', 'start-stackable' ); ?>","showTitle":true} /-->

<!-- wp:post-navigation-link {"label":"<?php echo esc_attr_x( 'Next post', 'Post navigation label', 'start-stackable' ); ?>","showTitle":true} /--></div>
<!-- /wp:group -->

<!-- wp:pattern {"slug":"start-stackable/comments"} /--></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
