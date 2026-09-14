<?php
/**
 * Title: Homepage
 * Slug: start-stackable/page-home
 * Description: A complete core-block homepage designed for the Full Width template.
 * Categories: featured
 * Block Types: core/post-content
 * Inserter: true
 */
?>

<!-- wp:cover {"dimRatio":100,"overlayColor":"primary-deep","minHeight":680,"minHeightUnit":"px","align":"full","textColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-cover alignfull has-base-color has-text-color" style="padding-top:var(--wp--preset--spacing--xxxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxxx-large);padding-left:var(--wp--preset--spacing--xx-large);min-height:680px"><span aria-hidden="true" class="wp-block-cover__background has-primary-deep-background-color has-background-dim-100 has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|large"}},"layout":{"type":"constrained","contentSize":"760px","justifyContent":"left"}} -->
<div class="wp-block-group alignwide"><!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><?php esc_html_e( 'A thoughtful place to begin', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"fontSize":"xxx-large"} -->
<h1 class="wp-block-heading has-xxx-large-font-size"><?php esc_html_e( 'Build a site that feels like yours.', 'start-stackable' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"medium"} -->
<p class="has-medium-font-size"><?php esc_html_e( 'Start with a clear foundation, shape it around your story, and grow without rebuilding the basics.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"var:preset|spacing|x-large"}}}} -->
<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--x-large)"><!-- wp:button {"backgroundColor":"base","textColor":"primary-deep"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-primary-deep-color has-base-background-color has-text-color has-background wp-element-button" href="#start-here"><?php esc_html_e( 'Start here', 'start-stackable' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"textColor":"base","style":{"color":{"background":"transparent"},"border":{"color":"var:preset|color|base","style":"solid","width":"2px"}},"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-base-color has-text-color has-background has-border-color wp-element-button" href="#latest-stories" style="border-color:var(--wp--preset--color--base);border-style:solid;border-width:2px;background-color:transparent"><?php esc_html_e( 'Explore latest stories', 'start-stackable' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div></div>
<!-- /wp:cover -->

<!-- wp:group {"anchor":"start-here","align":"full","backgroundColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div id="start-here" class="wp-block-group alignfull has-base-background-color has-background" style="padding-top:var(--wp--preset--spacing--xxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|x-large"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"layout":{"type":"constrained","contentSize":"760px"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"align":"center","textColor":"primary-deep","fontSize":"small"} -->
<p class="has-text-align-center has-primary-deep-color has-text-color has-small-font-size"><?php esc_html_e( 'Built for your next chapter', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-text-align-center has-xx-large-font-size"><?php esc_html_e( 'Everything you need to begin with confidence.', 'start-stackable' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","textColor":"contrast-accent"} -->
<p class="has-text-align-center has-contrast-accent-color has-text-color"><?php esc_html_e( 'A focused starting point keeps the essentials close and leaves room for the details that make the site your own.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"var:preset|spacing|large"}}}} -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"backgroundColor":"tint","style":{"border":{"radius":"var:preset|border-radius|large"},"shadow":"var:preset|shadow|small","spacing":{"blockGap":"var:preset|spacing|medium","padding":{"top":"var:preset|spacing|x-large","right":"var:preset|spacing|x-large","bottom":"var:preset|spacing|x-large","left":"var:preset|spacing|x-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-tint-background-color has-background" style="border-radius:var(--wp--preset--border-radius--large);padding-top:var(--wp--preset--spacing--x-large);padding-right:var(--wp--preset--spacing--x-large);padding-bottom:var(--wp--preset--spacing--x-large);padding-left:var(--wp--preset--spacing--x-large);box-shadow:var(--wp--preset--shadow--small)"><!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size"><?php esc_html_e( 'A clear foundation', 'start-stackable' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"contrast-accent"} -->
<p class="has-contrast-accent-color has-text-color"><?php esc_html_e( 'A considered structure helps every page feel connected from the first visit.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"backgroundColor":"tint","style":{"border":{"radius":"var:preset|border-radius|large"},"shadow":"var:preset|shadow|small","spacing":{"blockGap":"var:preset|spacing|medium","padding":{"top":"var:preset|spacing|x-large","right":"var:preset|spacing|x-large","bottom":"var:preset|spacing|x-large","left":"var:preset|spacing|x-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-tint-background-color has-background" style="border-radius:var(--wp--preset--border-radius--large);padding-top:var(--wp--preset--spacing--x-large);padding-right:var(--wp--preset--spacing--x-large);padding-bottom:var(--wp--preset--spacing--x-large);padding-left:var(--wp--preset--spacing--x-large);box-shadow:var(--wp--preset--shadow--small)"><!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size"><?php esc_html_e( 'Designed to adapt', 'start-stackable' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"contrast-accent"} -->
<p class="has-contrast-accent-color has-text-color"><?php esc_html_e( 'Color and typography styles give the same content a distinct point of view.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"backgroundColor":"tint","style":{"border":{"radius":"var:preset|border-radius|large"},"shadow":"var:preset|shadow|small","spacing":{"blockGap":"var:preset|spacing|medium","padding":{"top":"var:preset|spacing|x-large","right":"var:preset|spacing|x-large","bottom":"var:preset|spacing|x-large","left":"var:preset|spacing|x-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-tint-background-color has-background" style="border-radius:var(--wp--preset--border-radius--large);padding-top:var(--wp--preset--spacing--x-large);padding-right:var(--wp--preset--spacing--x-large);padding-bottom:var(--wp--preset--spacing--x-large);padding-left:var(--wp--preset--spacing--x-large);box-shadow:var(--wp--preset--shadow--small)"><!-- wp:heading {"level":3,"fontSize":"large"} -->
<h3 class="wp-block-heading has-large-font-size"><?php esc_html_e( 'Ready for your content', 'start-stackable' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"contrast-accent"} -->
<p class="has-contrast-accent-color has-text-color"><?php esc_html_e( 'Core WordPress blocks keep writing, editing, and publishing familiar.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","backgroundColor":"tint","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-tint-background-color has-background" style="padding-top:var(--wp--preset--spacing--xxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:columns {"align":"wide","verticalAlignment":"center","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|xx-large"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","width":"58%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:58%"><!-- wp:heading {"fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-xx-large-font-size"><?php esc_html_e( 'Make space for what matters most.', 'start-stackable' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"contrast-accent","fontSize":"medium"} -->
<p class="has-contrast-accent-color has-text-color has-medium-font-size"><?php esc_html_e( 'Use this page as a beginning, then replace the words, reorder the sections, and choose the style that fits your work.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"42%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:42%"><!-- wp:group {"backgroundColor":"base","style":{"border":{"radius":"var:preset|border-radius|large"},"shadow":"var:preset|shadow|medium","spacing":{"blockGap":"var:preset|spacing|large","padding":{"top":"var:preset|spacing|x-large","right":"var:preset|spacing|x-large","bottom":"var:preset|spacing|x-large","left":"var:preset|spacing|x-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-base-background-color has-background" style="border-radius:var(--wp--preset--border-radius--large);padding-top:var(--wp--preset--spacing--x-large);padding-right:var(--wp--preset--spacing--x-large);padding-bottom:var(--wp--preset--spacing--x-large);padding-left:var(--wp--preset--spacing--x-large);box-shadow:var(--wp--preset--shadow--medium)"><!-- wp:paragraph {"textColor":"primary-deep","fontSize":"small"} -->
<p class="has-primary-deep-color has-text-color has-small-font-size"><?php esc_html_e( 'Your site, your direction', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"x-large"} -->
<h3 class="wp-block-heading has-x-large-font-size"><?php esc_html_e( 'Change the look without changing the foundation.', 'start-stackable' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"contrast-accent"} -->
<p class="has-contrast-accent-color has-text-color"><?php esc_html_e( 'Explore the theme styles in the Site Editor whenever you want a different mood.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->

<!-- wp:group {"anchor":"latest-stories","align":"full","backgroundColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div id="latest-stories" class="wp-block-group alignfull has-base-background-color has-background" style="padding-top:var(--wp--preset--spacing--xxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|x-large"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"bottom"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|small"}},"layout":{"type":"constrained","justifyContent":"left"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"textColor":"primary-deep","fontSize":"small"} -->
<p class="has-primary-deep-color has-text-color has-small-font-size"><?php esc_html_e( 'From the journal', 'start-stackable' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-xx-large-font-size"><?php esc_html_e( 'Latest stories', 'start-stackable' ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"textColor":"contrast-accent"} -->
<p class="has-contrast-accent-color has-text-color"><?php esc_html_e( 'Fresh ideas and updates from the site.', 'start-stackable' ); ?></p>
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

<!-- wp:group {"align":"full","backgroundColor":"primary-soft","textColor":"outline-contrast","style":{"spacing":{"padding":{"top":"var:preset|spacing|xxx-large","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xxx-large","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-outline-contrast-color has-primary-soft-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--xxx-large);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xxx-large);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|small"}},"layout":{"type":"constrained","contentSize":"760px","justifyContent":"left"}} -->
<div class="wp-block-group"><!-- wp:heading {"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-x-large-font-size"><?php esc_html_e( 'Ready to make this space your own?', 'start-stackable' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Replace this invitation with the next step you want visitors to take.', 'start-stackable' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"outline-contrast","textColor":"base"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-base-color has-outline-contrast-background-color has-text-color has-background wp-element-button" href="#start-here"><?php esc_html_e( 'Begin your story', 'start-stackable' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
