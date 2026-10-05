<?php
/**
 * Title: Homepage
 * Slug: start-stackable/page-home
 * Description: An editorial core-block homepage designed for the Full Width template.
 * Categories: featured
 * Block Types: core/post-content
 * Inserter: true
 */
?>

<!-- wp:cover {"dimRatio":100,"overlayColor":"base-accent","minHeight":760,"minHeightUnit":"px","align":"full","textColor":"outline-contrast","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-cover alignfull has-outline-contrast-color has-text-color" style="padding-top:var(--wp--preset--spacing--xxxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxx-large);padding-left:var(--wp--preset--spacing--xx-large);min-height:760px"><span aria-hidden="true" class="wp-block-cover__background has-base-accent-background-color has-background-dim-100 has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|xx-large"}},"layout":{"type":"constrained","justifyContent":"left"}} -->
<div class="wp-block-group alignwide"><!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><?php esc_html_e( 'Independent ideas, thoughtfully made', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"fontSize":"xxx-large"} -->
<h1 class="wp-block-heading has-xxx-large-font-size"><?php esc_html_e( 'Make something people remember.', 'start-stackable' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:columns {"verticalAlignment":"bottom","align":"full","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|xx-large"}}}} -->
<div class="wp-block-columns alignfull are-vertically-aligned-bottom"><!-- wp:column {"verticalAlignment":"bottom","width":"55%"} -->
<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:55%"><!-- wp:paragraph {"fontSize":"medium"} -->
<p class="has-medium-font-size"><?php esc_html_e( 'A flexible starting point for studios, makers, and teams with a clear point of view.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"bottom","width":"45%"} -->
<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:45%"><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"right"}} -->
<div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"primary-deep","textColor":"base"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-base-color has-primary-deep-background-color has-text-color has-background wp-element-button" href="#selected-work"><?php esc_html_e( 'See the work', 'start-stackable' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"textColor":"outline-contrast","style":{"color":{"background":"transparent"},"border":{"color":"var:preset|color|outline-contrast","style":"solid","width":"1px"}},"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-outline-contrast-color has-text-color has-background has-border-color wp-element-button" href="#capabilities" style="border-color:var(--wp--preset--color--outline-contrast);border-style:solid;border-width:1px;background-color:transparent"><?php esc_html_e( 'What we do', 'start-stackable' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group --></div></div>
<!-- /wp:cover -->

<!-- wp:group {"align":"full","backgroundColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-background-color has-background" style="padding-top:var(--wp--preset--spacing--xxxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|xx-large"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"25%"} -->
<div class="wp-block-column" style="flex-basis:25%"><!-- wp:paragraph {"textColor":"contrast-accent","fontSize":"small"} -->
<p class="has-contrast-accent-color has-text-color has-small-font-size"><?php esc_html_e( 'A different kind of beginning', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"75%"} -->
<div class="wp-block-column" style="flex-basis:75%"><!-- wp:heading {"fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-xx-large-font-size"><?php esc_html_e( 'Clear thinking, expressive design, and room for your best work.', 'start-stackable' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"contrast-accent","fontSize":"medium","style":{"spacing":{"margin":{"top":"var:preset|spacing|large"}}}} -->
<p class="has-contrast-accent-color has-text-color has-medium-font-size" style="margin-top:var(--wp--preset--spacing--large)"><?php esc_html_e( 'Use the structure as it is or make it entirely your own. Every section is built with familiar WordPress blocks and the theme design system.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->

<!-- wp:group {"anchor":"selected-work","align":"full","backgroundColor":"tint","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div id="selected-work" class="wp-block-group alignfull has-tint-background-color has-background" style="padding-top:var(--wp--preset--spacing--xxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|x-large"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"bottom"}} -->
<div class="wp-block-group"><!-- wp:heading {"fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-xx-large-font-size"><?php esc_html_e( 'Selected work', 'start-stackable' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"contrast-accent"} -->
<p class="has-contrast-accent-color has-text-color"><?php esc_html_e( 'Two spaces ready for the stories you want to lead with.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"var:preset|spacing|large"}}}} -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"backgroundColor":"base-accent","textColor":"outline-contrast","style":{"border":{"radius":"var:preset|border-radius|large"},"dimensions":{"minHeight":"560px"},"spacing":{"blockGap":"var:preset|spacing|medium","padding":{"top":"var:preset|spacing|x-large","right":"var:preset|spacing|x-large","bottom":"var:preset|spacing|x-large","left":"var:preset|spacing|x-large"}}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"space-between"}} -->
<div class="wp-block-group has-outline-contrast-color has-base-accent-background-color has-text-color has-background" style="border-radius:var(--wp--preset--border-radius--large);min-height:560px;padding-top:var(--wp--preset--spacing--x-large);padding-right:var(--wp--preset--spacing--x-large);padding-bottom:var(--wp--preset--spacing--x-large);padding-left:var(--wp--preset--spacing--x-large)"><!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><?php esc_html_e( '01 · Identity and digital', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|small"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"fontSize":"x-large"} -->
<h3 class="wp-block-heading has-x-large-font-size"><?php esc_html_e( 'A bold identity for a new point of view.', 'start-stackable' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Replace this panel with a project, service, product, or idea worth remembering.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"backgroundColor":"primary-deep","textColor":"base","style":{"border":{"radius":"var:preset|border-radius|large"},"dimensions":{"minHeight":"560px"},"spacing":{"blockGap":"var:preset|spacing|medium","padding":{"top":"var:preset|spacing|x-large","right":"var:preset|spacing|x-large","bottom":"var:preset|spacing|x-large","left":"var:preset|spacing|x-large"}}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"space-between"}} -->
<div class="wp-block-group has-base-color has-primary-deep-background-color has-text-color has-background" style="border-radius:var(--wp--preset--border-radius--large);min-height:560px;padding-top:var(--wp--preset--spacing--x-large);padding-right:var(--wp--preset--spacing--x-large);padding-bottom:var(--wp--preset--spacing--x-large);padding-left:var(--wp--preset--spacing--x-large)"><!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><?php esc_html_e( '02 · Strategy and experience', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|small"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"textColor":"base","fontSize":"x-large"} -->
<h3 class="wp-block-heading has-base-color has-text-color has-x-large-font-size"><?php esc_html_e( 'Useful ideas shaped into lasting experiences.', 'start-stackable' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Let the contrast, generous scale, and simple details give the content its presence.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"anchor":"capabilities","align":"full","backgroundColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div id="capabilities" class="wp-block-group alignfull has-base-background-color has-background" style="padding-top:var(--wp--preset--spacing--xxxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|xx-large"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"35%"} -->
<div class="wp-block-column" style="flex-basis:35%"><!-- wp:paragraph {"textColor":"contrast-accent","fontSize":"small"} -->
<p class="has-contrast-accent-color has-text-color has-small-font-size"><?php esc_html_e( 'Capabilities', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-x-large-font-size"><?php esc_html_e( 'From the first question to the final detail.', 'start-stackable' ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"65%"} -->
<div class="wp-block-column" style="flex-basis:65%"><!-- wp:separator {"backgroundColor":"outline","className":"is-style-wide"} -->
<hr class="wp-block-separator has-text-color has-outline-color has-alpha-channel-opacity has-outline-background-color has-background is-style-wide"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":3,"fontSize":"large","style":{"spacing":{"margin":{"top":"var:preset|spacing|large","bottom":"var:preset|spacing|large"}}}} -->
<h3 class="wp-block-heading has-large-font-size" style="margin-top:var(--wp--preset--spacing--large);margin-bottom:var(--wp--preset--spacing--large)"><?php esc_html_e( 'Strategy and direction', 'start-stackable' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:separator {"backgroundColor":"outline","className":"is-style-wide"} -->
<hr class="wp-block-separator has-text-color has-outline-color has-alpha-channel-opacity has-outline-background-color has-background is-style-wide"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":3,"fontSize":"large","style":{"spacing":{"margin":{"top":"var:preset|spacing|large","bottom":"var:preset|spacing|large"}}}} -->
<h3 class="wp-block-heading has-large-font-size" style="margin-top:var(--wp--preset--spacing--large);margin-bottom:var(--wp--preset--spacing--large)"><?php esc_html_e( 'Identity and expression', 'start-stackable' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:separator {"backgroundColor":"outline","className":"is-style-wide"} -->
<hr class="wp-block-separator has-text-color has-outline-color has-alpha-channel-opacity has-outline-background-color has-background is-style-wide"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":3,"fontSize":"large","style":{"spacing":{"margin":{"top":"var:preset|spacing|large","bottom":"var:preset|spacing|large"}}}} -->
<h3 class="wp-block-heading has-large-font-size" style="margin-top:var(--wp--preset--spacing--large);margin-bottom:var(--wp--preset--spacing--large)"><?php esc_html_e( 'Digital design and experience', 'start-stackable' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:separator {"backgroundColor":"outline","className":"is-style-wide"} -->
<hr class="wp-block-separator has-text-color has-outline-color has-alpha-channel-opacity has-outline-background-color has-background is-style-wide"/>
<!-- /wp:separator --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","backgroundColor":"primary-deep","textColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-primary-deep-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--xxxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","layout":{"type":"constrained","contentSize":"1100px","justifyContent":"left"}} -->
<div class="wp-block-group alignwide"><!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><?php esc_html_e( 'Our approach', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textColor":"base","fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-base-color has-text-color has-xx-large-font-size"><?php esc_html_e( 'Start with what matters. Remove what does not. Make the rest unmistakable.', 'start-stackable' ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"anchor":"latest-stories","align":"full","backgroundColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div id="latest-stories" class="wp-block-group alignfull has-base-background-color has-background" style="padding-top:var(--wp--preset--spacing--xxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|x-large"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"bottom"}} -->
<div class="wp-block-group"><!-- wp:heading {"fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-xx-large-font-size"><?php esc_html_e( 'Notes and stories', 'start-stackable' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"contrast-accent"} -->
<p class="has-contrast-accent-color has-text-color"><?php esc_html_e( 'The latest thinking, news, and observations from the journal.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:query {"queryId":7,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"layout":{"type":"default"}} -->
<div class="wp-block-query"><!-- wp:post-template {"style":{"spacing":{"blockGap":"var:preset|spacing|large"}},"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:pattern {"slug":"start-stackable/post-card"} /-->
<!-- /wp:post-template -->

<!-- wp:query-no-results -->
<!-- wp:group {"backgroundColor":"tint","style":{"border":{"radius":"var:preset|border-radius|large"},"spacing":{"padding":{"top":"var:preset|spacing|x-large","right":"var:preset|spacing|x-large","bottom":"var:preset|spacing|x-large","left":"var:preset|spacing|x-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-tint-background-color has-background" style="border-radius:var(--wp--preset--border-radius--large);padding-top:var(--wp--preset--spacing--x-large);padding-right:var(--wp--preset--spacing--x-large);padding-bottom:var(--wp--preset--spacing--x-large);padding-left:var(--wp--preset--spacing--x-large)"><!-- wp:paragraph {"textColor":"contrast-accent"} -->
<p class="has-contrast-accent-color has-text-color"><?php esc_html_e( 'Publish your first post and it will appear here.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","backgroundColor":"base-accent","textColor":"outline-contrast","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-outline-contrast-color has-base-accent-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--xxxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|x-large"}},"layout":{"type":"constrained","contentSize":"1040px","justifyContent":"left"}} -->
<div class="wp-block-group alignwide"><!-- wp:heading {"fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-xx-large-font-size"><?php esc_html_e( 'Have something worth making?', 'start-stackable' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"fontSize":"medium"} -->
<p class="has-medium-font-size"><?php esc_html_e( 'Turn this closing note into a clear invitation for your visitors.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"primary-deep","textColor":"base"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-base-color has-primary-deep-background-color has-text-color has-background wp-element-button" href="#"><?php esc_html_e( 'Start a conversation', 'start-stackable' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
