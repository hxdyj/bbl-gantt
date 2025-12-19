import { DefaultTheme, defineConfig } from 'vitepress'
import pkg from '../../../package.json'
export const en = defineConfig({
	lang: 'en-US',
	description: 'Vite & Vue powered static site generator.',

	themeConfig: {
		outline: {
			label: 'Outline',
			level: 'deep'
		},
		nav: nav(),
		sidebar: {
			'/en/start/': {
				base: '/en/start',
				items: [
					{ text: 'Introduction', link: '/introduction' },
					{ text: 'Getting Started', link: '/start' },
				]
			},
			'/en/api/': {
				base: '/en/api',
				items: [
					{
						text: 'Gantt Class', items: [
							{ text: 'Constructor', link: '/constructor-options' },
							{ text: 'Properties', link: '/constructor-props' },
							{ text: 'Methods', link: '/constructor-methods' },
							{ text: 'Events', link: '/constructor-on' },
						]
					},
					{
						text: 'View Class', link: '/view-class', items: []
					},
					{
						text: 'Time Class', link: '/time-class', items: []
					},
					{
						text: 'Render Class', link: '/render-class', items: [
							{ text: 'Header', link: '/render/header' },
							{ text: 'Rows', link: '/render/rows' },
							{ text: 'Ticks', link: '/render/ticks' },
							{ text: 'Events', link: '/render/events' },
						]
					},
					{
						text: 'CSS Variables', link: '/css-vars', items: []
					}
				]
			},
		},

		// editLink: {
		// 	pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
		// 	text: 'Edit this page on GitHub'
		// },
		footer: {
			message: 'Released under the <a href="https://github.com/hxdyj/bbl-gantt/blob/main/LICENSE">MIT License</a>.',
			copyright: `Copyright © 2025-present <a href="https://github.com/hxdyj">hxdyj</a>`
		}
	}
})

function nav(): DefaultTheme.NavItem[] {
	return [
		{
			text: 'Demo',
			link: 'https://bbl-gantt.demo.wingblog.top',
		},
		{
			text: 'Start',
			link: '/en/start/start',
			activeMatch: '/en/start'
		},
		{
			text: 'API',
			link: '/en/api/constructor-options',
			activeMatch: '/en/api'
		},
		{
			text: 'Sponsor',
			link: '/en/sponsor',
			activeMatch: '/en/sponsor'
		},
		{
			text: pkg.version,
			items: [
				{
					text: 'Changelog',
					link: 'https://github.com/hxdyj/bbl-gantt/releases'
				}
			]
		}
	]
}


export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
	en: {
		placeholder: 'Search Documentation',
		translations: {
			button: {
				buttonText: 'Search Documentation',
				buttonAriaLabel: 'Search Documentation'
			},
			modal: {
				searchBox: {
					resetButtonTitle: 'Clear Query',
					resetButtonAriaLabel: 'Clear Query',
					cancelButtonText: 'Cancel',
					cancelButtonAriaLabel: 'Cancel'
				},
				startScreen: {
					recentSearchesTitle: 'Recent Searches',
					noRecentSearchesText: 'No recent searches',
					saveRecentSearchButtonTitle: 'Save to Recent Searches',
					removeRecentSearchButtonTitle: 'Remove from Recent Searches',
					favoriteSearchesTitle: 'Favorites',
					removeFavoriteSearchButtonTitle: 'Remove from Favorites'
				},
				errorScreen: {
					titleText: 'Unable to Fetch Results',
					helpText: 'You may need to check your network connection'
				},
				footer: {
					selectText: 'Select',
					navigateText: 'Navigate',
					closeText: 'Close',
					searchByText: 'Search by provider'
				},
				noResultsScreen: {
					noResultsText: 'No results found',
					suggestedQueryText: 'You can try searching for',
					reportMissingResultsText: 'Do you think this query should have results?',
					reportMissingResultsLinkText: 'Click to report'
				}
			}
		}
	}
}
