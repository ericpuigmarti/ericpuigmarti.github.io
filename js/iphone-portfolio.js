(function ($) {
	'use strict';

	/* -----------------------------------------------------------------------
	   Project data
	----------------------------------------------------------------------- */
	var PROJECTS = {
		freshbooks: {
			name: 'FreshBooks',
			role: 'Lead Product Designer',
			years: '2015 – 2018',
			tagline: 'Helping small businesses get paid 2× faster.',
			achievements: [
				'Redesigned core invoicing and payments flow — adopted by 10M+ users across web and iOS',
				'Shipped mobile-first billing experience that reduced time-to-payment by 40%',
				'Nominated for a 2017 Webby Award for Financial Services & Banking'
			],
			caseStudyUrl: 'freshbooks.html'
		},
		league: {
			name: 'League',
			role: 'Principal Product Designer',
			years: '2018 – 2021',
			tagline: 'Personalizing healthcare with better data.',
			achievements: [
				'Led design of the Health Profile platform serving millions of users across North America',
				'Contributed to Deloitte Technology Fast 50 recognition in 2020',
				'Forbes featured: "The Platformization Of Healthcare Is Here" (2022)'
			],
			caseStudyUrl: 'league.html'
		},
		inflow: {
			name: 'Inflow',
			role: 'Product Design Lead',
			years: '2021 – 2022',
			tagline: 'Affordable and accessible ADHD care.',
			achievements: [
				'Designed CBT-based learning app from 0→1 for the ADHD community',
				'Led end-to-end UX for onboarding, assessment, and content modules',
				'Established cross-platform design system for iOS and web'
			],
			caseStudyUrl: 'inflow.html'
		},
		telus: {
			name: 'TELUS Mobility',
			role: 'UX Designer',
			years: '2013 – 2015',
			tagline: 'A phone bill that finally makes sense.',
			achievements: [
				'Won Canada Post Best Mobile Experience Award (2014)',
				'Redesigned MyAccount usage meter for 5M+ subscribers',
				'Pioneered mobile-first design strategy at TELUS Labs'
			],
			caseStudyUrl: 'telus.html'
		},
		shifthub: {
			name: 'ShiftHub',
			role: 'Lead Product Designer',
			years: '2015',
			tagline: 'A smarter way to schedule and manage staff.',
			achievements: [
				'Designed responsive workforce scheduling platform end-to-end',
				'Created drag-and-drop shift builder reducing manager scheduling time by 60%',
				'Built component library and design system for product scale'
			],
			caseStudyUrl: 'shifthub.html'
		},
		venio: {
			name: 'Venio Health',
			role: 'Product Designer',
			years: '2012 – 2013',
			tagline: 'Healthy eating made beautifully simple.',
			achievements: [
				'Designed iOS nutritional recommendation app from concept to App Store launch',
				'Created personalized meal-planning flows tied to habit and taste data',
				'Shipped onboarding experience that drove 70%+ profile completion rate'
			],
			caseStudyUrl: 'venio.html'
		}
	};

	/* -----------------------------------------------------------------------
	   State
	----------------------------------------------------------------------- */
	var $iphoneShell    = null;
	var $scaleWrapper   = null;
	var $homescreen     = null;
	var $overlay        = null;
	var originalRect    = null;
	var isOpen          = false;

	/* -----------------------------------------------------------------------
	   Build project HTML
	----------------------------------------------------------------------- */
	function buildProjectHTML(project) {
		var items = project.achievements.map(function (a) {
			return '<li>' + a + '</li>';
		}).join('');

		return [
			'<div class="tc-meta">',
				'<span class="tc-role">' + project.role + '</span>',
				'<span class="tc-years">' + project.years + '</span>',
			'</div>',
			'<h2 class="tc-name">' + project.name + '</h2>',
			'<p class="tc-tagline">' + project.tagline + '</p>',
			'<hr class="tc-divider">',
			'<ul class="tc-achievements">' + items + '</ul>',
			'<a class="tc-cta" href="' + project.caseStudyUrl + '">View Case Study &rarr;</a>'
		].join('');
	}

	/* -----------------------------------------------------------------------
	   Open project
	----------------------------------------------------------------------- */
	function openProject(key) {
		if (isOpen) return;
		var project = PROJECTS[key];
		if (!project) return;

		isOpen = true;

		// Populate content before animating
		$('#takeoverContent').html(buildProjectHTML(project));

		// Snapshot position so we can animate back precisely
		originalRect = $iphoneShell[0].getBoundingClientRect();

		// Pause float animation
		$scaleWrapper.addClass('is-animating');

		// Lock shell to its current viewport position so CSS transition has a from-value
		$iphoneShell.css({
			position: 'fixed',
			top:    originalRect.top  + 'px',
			left:   originalRect.left + 'px',
			width:  originalRect.width  + 'px',
			height: originalRect.height + 'px',
			margin: 0
		});

		// Force reflow so the browser registers the starting values
		$iphoneShell[0].getBoundingClientRect();

		// Trigger expand
		$iphoneShell.addClass('is-expanding');

		// After geometry settles, fade in overlay
		setTimeout(function () {
			$homescreen.css({ opacity: 0 });
			$overlay.addClass('is-open');
			$overlay.attr('aria-hidden', 'false');
		}, 380);
	}

	/* -----------------------------------------------------------------------
	   Close project
	----------------------------------------------------------------------- */
	function closeProject() {
		if (!isOpen) return;

		// Fade out overlay content first
		$overlay.removeClass('is-open');
		$overlay.attr('aria-hidden', 'true');

		// Start collapsing iPhone back to original position after overlay starts fading
		setTimeout(function () {
			// Remove expanding state — CSS transition animates back to fixed + recorded coords
			$iphoneShell.removeClass('is-expanding');

			// Apply the original rect as the target
			$iphoneShell.css({
				top:    originalRect.top  + 'px',
				left:   originalRect.left + 'px',
				width:  originalRect.width  + 'px',
				height: originalRect.height + 'px'
			});

			// After the transition completes, restore normal flow positioning
			setTimeout(function () {
				$iphoneShell.css({
					position: '',
					top:    '',
					left:   '',
					width:  '',
					height: '',
					margin: ''
				});
				$homescreen.css({ opacity: '' });
				$scaleWrapper.removeClass('is-animating');
				isOpen = false;
			}, 520);
		}, 200);
	}

	/* -----------------------------------------------------------------------
	   Init
	----------------------------------------------------------------------- */
	$(document).ready(function () {
		if ($('body').data('page') !== 'iphonePortfolioPage') return;

		$iphoneShell  = $('#iphoneShell');
		$scaleWrapper = $iphoneShell.closest('.iphone-scale-wrapper');
		$homescreen   = $('#iphoneHomescreen');
		$overlay      = $('#takeover-overlay');

		// Icon tap
		$(document).on('click keypress', '.app-icon', function (e) {
			if (e.type === 'keypress' && e.which !== 13) return;
			var key = $(this).data('project');
			$(this).addClass('icon-tapped');

			var $icon = $(this);
			setTimeout(function () {
				$icon.removeClass('icon-tapped');
			}, 300);

			setTimeout(function () {
				openProject(key);
			}, 150);
		});

		// Close button
		$('.takeover-close').on('click', closeProject);

		// Escape key
		$(document).on('keydown', function (e) {
			if (e.key === 'Escape' || e.keyCode === 27) closeProject();
		});

		// Clicking outside the content area also closes
		$overlay.on('click', function (e) {
			if ($(e.target).is('#takeover-overlay') || $(e.target).is('.takeover-inner')) {
				closeProject();
			}
		});
	});

}(jQuery));
