<?php
/**
 * Title: Search Results
 * Slug: start-stackable/template-search
 * Categories: posts
 * Template Types: search
 * Inserter: false
 */
?>

<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|xx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--xx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|large","margin":{"bottom":"var:preset|spacing|x-large"}}},"layout":{"type":"constrained","justifyContent":"left"}} -->
<div class="wp-block-group alignwide" style="margin-bottom:var(--wp--preset--spacing--x-large)"><!-- wp:query-title {"type":"search","fontSize":"xx-large"} /-->

<!-- wp:search {"label":"<?php echo esc_attr_x( 'Search', 'Search form label', 'start-stackable' ); ?>","showLabel":false,"placeholder":"<?php echo esc_attr_x( 'Search the site', 'Search form placeholder', 'start-stackable' ); ?>","buttonText":"<?php echo esc_attr_x( 'Search', 'Search form button', 'start-stackable' ); ?>","buttonUseIcon":true} /--></div>
<!-- /wp:group -->

<!-- wp:query {"queryId":0,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true},"align":"wide","layout":{"type":"default"}} -->
<div class="wp-block-query alignwide"><!-- wp:post-template {"style":{"spacing":{"blockGap":"var:preset|spacing|x-large"}},"layout":{"type":"grid","columnCount":2}} -->
<!-- wp:pattern {"slug":"start-stackable/post-card"} /-->
<!-- /wp:post-template -->

<!-- wp:query-pagination {"style":{"spacing":{"margin":{"top":"var:preset|spacing|x-large"}}},"layout":{"type":"flex","justifyContent":"space-between"}} -->
<!-- wp:query-pagination-previous /-->

<!-- wp:query-pagination-numbers /-->

<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->

<!-- wp:query-no-results -->
<!-- wp:group {"backgroundColor":"tint","style":{"border":{"radius":"var:preset|border-radius|large"},"spacing":{"padding":{"top":"var:preset|spacing|x-large","right":"var:preset|spacing|x-large","bottom":"var:preset|spacing|x-large","left":"var:preset|spacing|x-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-tint-background-color has-background" style="border-radius:var(--wp--preset--border-radius--large);padding-top:var(--wp--preset--spacing--x-large);padding-right:var(--wp--preset--spacing--x-large);padding-bottom:var(--wp--preset--spacing--x-large);padding-left:var(--wp--preset--spacing--x-large)"><!-- wp:heading {"level":2,"fontSize":"large"} -->
<h2 class="wp-block-heading has-large-font-size"><?php esc_html_e( 'Nothing matched your search', 'start-stackable' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"contrast-accent"} -->
<p class="has-contrast-accent-color has-text-color"><?php esc_html_e( 'Try another word or phrase.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query --></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
