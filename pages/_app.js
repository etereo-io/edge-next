import '../styles/index.scss'
//import '../styles/refactor.scss'

import * as gtag from '../lib/client/gtag'

import withEdgeTheme, {
  EdgeThemeContext,
} from '../lib/client/contexts/edge-theme'

import { EdgeUserProvider } from '../lib/client/contexts/edge-user'
import Router from 'next/router'
import { useContext } from 'react'

// Store navigation events on Google analytics
Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))

function MyApp({ Component, pageProps }) {
  const { mode } = useContext(EdgeThemeContext)

  return (
    <>
      <div id="app-container" className={mode}>
        <EdgeUserProvider>
          <Component {...pageProps} />
        </EdgeUserProvider>
      </div>
      <style jsx global>{`
        // Global variables
        :root {
          --edge-gap: 16pt;
          --edge-gap-negative: -16pt;
          --edge-gap-half: 8pt;
          --edge-gap-half-negative: -8pt;
          --edge-gap-quarter: 4pt;
          --edge-gap-quarter-negative: -4pt;
          --edge-gap-medium: 24pt;
          --edge-gap-medium-negative: -24pt;
          --edge-gap-double: 32pt;
          --edge-gap-double-negative: -32pt;
          --edge-page-margin: 16pt;
          --edge-page-width: 750pt;
          --edge-page-extra-width: 1024px;
          --edge-page-max-width: 1292px;
          --edge-page-width-with-margin: 782pt;
          --edge-breakpoint-mobile: 600px;
          --edge-breakpoint-tablet: 960px;
          --edge-radius: 4px;
          --edge-marketing-radius: 8px;
          --edge-cyan: #79ffe1;
          --edge-cyan-dark: #50e3c2;
          --edge-cyan-darker: #29bc9b;
          --edge-purple: #f81ce5;
          --edge-violet: #7928ca;
          --edge-alert: #ff0080;
          --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
            'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
            'Helvetica Neue', sans-serif;
          --font-mono: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
          --header-height: 64px;
          --header-border-bottom: inset 0 -1px 0 0 rgba(0, 0, 0, 0.1);
          --header-background: hsla(0, 0%, 100%, 0.8);
          --edge-form-large-font: 1rem;
          --edge-form-large-height: 3rem;
          --edge-form-large-line-height: 1.5rem;
          --edge-form-small-font: 0.875rem;
          --edge-form-small-height: 2rem;
          --edge-form-small-line-height: 0.875rem;
          --edge-form-font: 0.875rem;
          --edge-form-height: 2.5rem;
          --edge-form-line-height: 1.25rem;
          --z-index-minimum: 1;
          --z-index-content: 2;
          --z-index-cover-content: 3;
          --z-index-header: 4;
          --z-index-toolbar: 5;
          --z-index-modal: 6;
          --z-index-maximum: 7;
        }

        // Theme variables
        :root {
          --edge-foreground: #000;
          --edge-background: #fff;
          --edge-selection: var(--edge-cyan);
          --accents-1: #fafafa;
          --accents-2: #eaeaea;
          --accents-3: #999;
          --accents-4: #888;
          --accents-5: #666;
          --accents-6: #444;
          --accents-7: #333;
          --accents-8: #111;
          --edge-link-color: var(--edge-foreground);
          --edge-marketing-gray: #fafbfc;
          --edge-code: var(--edge-purple);
          --edge-success-light: #3291ff;
          --edge-success: #0070f3;
          --edge-success-dark: #0366d6;
          --edge-success-soft: #0070f321;
          --edge-error-light: #ff1a1a;
          --edge-error: #e00;
          --edge-error-dark: #c00;
          --edge-warning-light: #f7b955;
          --edge-warning: #f5a623;
          --edge-warning-dark: #f49b0b;
          --edge-secondary-light: var(--accents-3);
          --edge-secondary: var(--accents-5);
          --edge-secondary-dark: var(--accents-7);
          --dropdown-box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.02);
          --dropdown-triangle-stroke: #fff;
          --scroller-start: #fff;
          --scroller-end: hsla(0, 0%, 100%, 0);
          --shadow-smallest: 0 2px 4px rgba(0, 0, 0, 0.05);
          --shadow-small: 0 5px 10px rgba(0, 0, 0, 0.12);
          --shadow-medium: 0 8px 30px rgba(0, 0, 0, 0.12);
          --shadow-large: 0 30px 60px rgba(0, 0, 0, 0.12);
          --shadow-hover: 0 30px 60px rgba(0, 0, 0, 0.12);
          --shadow-sticky: 0 12px 10px -10px rgba(0, 0, 0, 0.12);
          --portal-opacity: 0.25;
          --light-border-color: rgba(0, 0, 0, 0.2);
          --dark-border-color: rgba(255, 255, 255, 0.2);
          --light-border: 1px solid var(--light-border-color);
        }

        .dark-theme {
          --edge-foreground: #fff;
          --edge-background: #000;
          --edge-selection: var(--edge-purple);
          --accents-8: #fafafa;
          --accents-7: #eaeaea;
          --accents-6: #999;
          --accents-5: #888;
          --accents-4: #666;
          --accents-3: #444;
          --accents-2: #333;
          --accents-1: #111;
          --edge-success-light: #3291ff;
          --edge-success: #0070f3;
          --edge-success-dark: #0366d6;
          --edge-error-light: #f33;
          --edge-error: red;
          --edge-error-dark: #e60000;
          --edge-warning-light: #f7b955;
          --edge-warning: #f5a623;
          --edge-warning-dark: #f49b0b;
          --edge-secondary-light: var(--accents-3);
          --edge-secondary: var(--accents-5);
          --edge-secondary-dark: var(--accents-7);
          --edge-link-color: var(--edge-foreground);
          --edge-marketing-gray: var(--accents-1);
          --edge-code: var(--edge-cyan);
          --dropdown-box-shadow: 0 0 0 1px var(--accents-2);
          --dropdown-triangle-stroke: #333;
          --scroller-start: #000;
          --scroller-end: transparent;
          --header-background: rgba(0, 0, 0, 0.5);
          --header-border-bottom: inset 0 -1px 0 0 hsla(0, 0%, 100%, 0.1);
          --shadow-small: 0 0 0 1px var(--accents-2);
          --shadow-medium: 0 0 0 1px var(--accents-2);
          --shadow-large: 0 0 0 1px var(--accents-2);
          --shadow-sticky: 0 0 0 1px var(--accents-2);
          --shadow-hover: 0 0 0 1px var(--edge-foreground);
          --portal-opacity: 0.75;
          --light-border-color: rgba(255, 255, 255, 0.3);
          --light-border: 1px solid var(--light-border-color);
        }

        .robot-theme {
          --edge-foreground: #33cf33;
          --edge-background: #000;
          --edge-selection: var(--edge-purple);
          --accents-1: #082008;
          --accents-2: #0d360d;
          --accents-3: #124712;
          --accents-4: #165816;
          --accents-5: #1c721c;
          --accents-6: #1f7a1f;
          --accents-7: #269726;
          --accents-8: #2cbe2c;
          --edge-success-light: #3291ff;
          --edge-success: #0070f3;
          --edge-success-dark: #0366d6;
          --edge-error-light: #f33;
          --edge-error: red;
          --edge-error-dark: #e60000;
          --edge-warning-light: #f7b955;
          --edge-warning: #f5a623;
          --edge-warning-dark: #f49b0b;
          --edge-secondary-light: var(--accents-3);
          --edge-secondary: var(--accents-5);
          --edge-secondary-dark: var(--accents-7);
          --edge-link-color: var(--edge-foreground);
          --edge-marketing-gray: var(--accents-1);
          --edge-code: var(--edge-cyan);
          --dropdown-box-shadow: 0 0 0 1px var(--accents-2);
          --dropdown-triangle-stroke: #333;
          --scroller-start: #000;
          --scroller-end: transparent;
          --header-background: rgba(0, 0, 0, 0.5);
          --header-border-bottom: inset 0 -1px 0 0 hsla(0, 0%, 100%, 0.1);
          --shadow-small: 0 0 0 1px var(--accents-2);
          --shadow-medium: 0 0 0 1px var(--accents-2);
          --shadow-large: 0 0 0 1px var(--accents-2);
          --shadow-sticky: 0 0 0 1px var(--accents-2);
          --shadow-hover: 0 0 0 1px var(--edge-foreground);
          --portal-opacity: 0.75;
          --light-border-color: rgba(0, 255, 55, 0.3);
          --light-border: 1px solid var(--light-border-color);
        }

        .kawaii-theme {
          --edge-gap: 20pt;
          --edge-gap-negative: -20pt;
          --edge-gap-half: 8pt;
          --edge-gap-half-negative: -8pt;
          --edge-gap-quarter: 4pt;
          --edge-gap-quarter-negative: -4pt;
          --edge-gap-double: 32pt;
          --edge-gap-double-negative: -32pt;
          --edge-page-margin: 16pt;
          --edge-page-width: 750pt;
          --edge-page-max-width: 1024px;
          --edge-page-width-with-margin: 782pt;
          --edge-breakpoint-mobile: 600px;
          --edge-breakpoint-tablet: 960px;
          --edge-radius: 24px;

          --edge-foreground: white;
          --edge-background: #370e6d;
          --edge-selection: var(--edge-purple);
          --accents-8: #370e6d;
          --accents-7: #4b2480;
          --accents-6: #603797;
          --accents-5: #8559c0;
          --accents-4: #e7bfff;
          --accents-3: #ffc6ff;
          --accents-2: #ffceff;
          --accents-1: #ffd9ff;
          --edge-success-light: #3291ff;
          --edge-success: #0070f3;
          --edge-success-dark: #0366d6;
          --edge-error-light: #f33;
          --edge-error: red;
          --edge-error-dark: #e60000;
          --edge-warning-light: #f7b955;
          --edge-warning: #f5a623;
          --edge-warning-dark: #f49b0b;
          --edge-secondary-light: var(--accents-3);
          --edge-secondary: var(--accents-5);
          --edge-secondary-dark: var(--accents-7);
          --edge-link-color: var(--edge-foreground);
          --edge-marketing-gray: var(--accents-1);
          --edge-code: var(--edge-cyan);
          --dropdown-box-shadow: 0 0 0 1px var(--accents-2);
          --dropdown-triangle-stroke: #333;
          --scroller-start: #000;
          --scroller-end: transparent;
          --header-background: rgba(0, 0, 0, 0.5);
          --header-border-bottom: inset 0 -1px 0 0 hsla(0, 0%, 100%, 0.1);
          --shadow-small: 0 0 0 1px var(--accents-2);
          --shadow-medium: 0 0 0 1px var(--accents-2);
          --shadow-large: 0 0 0 1px var(--accents-2);
          --shadow-sticky: 0 0 0 1px var(--accents-2);
          --shadow-hover: 0 0 0 1px var(--edge-foreground);
          --portal-opacity: 0.75;
          --light-border-color: white;
          --light-border: 1px solid var(--light-border-color);
        }

        a {
          color: inherit;
        }

        #app-container {
          margin: 0;
          background-color: var(--edge-background);
          color: var(--edge-foreground);
        }

        main {
          min-height: calc(100vh - 332px);
        }

        .container {
          padding: 0 32px;
          position: relative;
          margin: 0 auto;
          max-width: var(--edge-page-max-width);
          width: 100%;
        }

        .edge-container {
          padding: 0 var(--edge-gap);
          margin: 0 auto;
          max-width: 1292px;
          width: 100%;
        }

        @media all and (max-width: 720px) {
          .container {
            padding: 0 var(--edge-gap);
          }
        }

        .error-message {
          color: var(--edge-error);
          font-size: var(--edge-form-small-font);
          line-height: 2;
        }

        .success-message {
          color: var(--edge-success);
          font-size: var(--edge-form-small-font);
          line-height: 2;
        }

        // Generic fields styles
        .input-group {
          margin-bottom: var(--edge-gap);
          position: relative;
          width: 100%;
        }

        .input-group label {
          display: block;
          font-size: var(--edge-form-large-font);
          font-weight: 500;
          padding-bottom: var(--edge-gap-half);
        }
        .input-group label::first-letter {
          text-transform: uppercase;
        }

        .input-group.required label:after {
          color: var(--edge-alert);
          content: '*';
          display: inline-block;
        }

        .input-group.error input,
        .input-group.error textarea,
        .input-group.error select {
          border-color: var(--edge-error);
        }

        .input-group.password {
          position: relative;
        }
        .input-group.password input {
          padding-right: 58px;
        }

        .input-group.password svg {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: var(--edge-gap);
          width: 22px;
        }

        .input-group.password svg path {
          fill: var(--edge-foreground);
        }

        .input-group.password svg.hide-password {
          display: none;
          margin-top: 1px;
        }

        .input-group.password .toggle-password {
          cursor: pointer;
        }

        .input-group.password .toggle-password &:hover svg.show-password {
          display: none;
        }
        .input-group.password .toggle-password &:hover svg.hide-password {
          display: block;
        }

        input,
        textarea,
        select {
          background: var(--edge-background);
          border: var(--light-border);
          border-radius: var(--edge-radius);
          color: var(--edge-foreground);
          font-size: var(--edge-form-large-font);
          padding: var(--edge-gap);
          transition: 0.25s ease;
          width: 100%;
        }

        input:focus,
        input:hover,
        textarea:focus,
        textarea:hover,
        select:focus,
        select:hover {
          border-color: var(--edge-foreground);
          outline: none;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
        }

        .input-select {
          position: relative;
        }
        .input-select:after {
          background: transparent;
          border-bottom: 2px solid var(--accents-5);
          border-right: 2px solid var(--accents-5);
          content: '';
          cursor: pointer;
          height: var(--edge-gap-half);
          position: absolute;
          pointer-events: none;
          right: var(--edge-gap);
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          transition: 0.25s ease;
          width: var(--edge-gap-half);
        }

        .input-radio-group {
          display: flex;
          flex-wrap: wrap;
        }

        .input-radio {
          display: inline-block;
          margin: var(--edge-gap);
          position: relative;
          width: 100%;
          flex: 1;
        }

        .input-radio:last-of-type {
          margin-right: 0;
        }

        .input-radio label {
          background: var(--edge-background);
          border: var(--light-border);
          border-radius: 4px;
          cursor: pointer;
          font-size: var(--edge-form-large-font);
          padding: var(--edge-gap);
          text-align: center;
          transition: 0.25s ease;
        }

        .input-radio input {
          left: 0;
          opacity: 0;
          position: absolute;
          top: 0;
        }

        .input-radio input:hover ~ label {
          border-color: var(--edge-foreground);
        }

        .input-radio input:checked ~ label {
          background: var(--edge-foreground);
          color: var(--edge-background);
        }

        select {
          appearance: none;
          padding-right: var(--edge-gap-double);
          -webkit-appearance: none;
        }

        /* Button Icon */

        .edge-button-icon {
          align-items: center;
          border: 2px solid var(--accents-2);
          border-radius: 50%;
          display: flex;
          height: 32px;
          justify-content: center;
          text-align: center;
          padding: 8px;
          width: 32px;
        }

        .edge-button-icon.edit-content {
          margin-left: 8px;
        }
        .edge-button-icon img {
          display: inline-block;
          vertical-align: middle;
          width: 15px;
        }

        /* Edge Button */
        .edge-button {
          background-color: var(--edge-success);
          border: none;
          border-radius: 4px;
          color: var(--edge-background);
          font-size: 13px;
          font-weight: 500;
          padding: var(--edge-gap-half) var(--edge-gap);
          position: relative;
        }

        .edge-button.has-icon {
          background-position: var(--edge-gap-half) 50%;
          background-repeat: no-repeat;
          background-size: 14px;
          padding-left: var(--edge-gap-medium);
        }

        .edge-button.has-icon.check {
          background-image: url('/refactor/icon-check.svg');
        }

        .edge-tag {
          background: var(--edge-foreground);
          border-radius: 4px;
          color: var(--edge-background);
          display: inline-block;
          font-size: 10px;
          font-weight: 500;
          padding: 4px 8px;
          text-transform: uppercase;
        }

        .edge-searchbox {
          position: relative;
        }

        .edge-searchbox img {
          left: 16px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
        }

        .edge-searchbox input {
          background-color: var(--accents-1);
          border: none;
          font-size: 14px;
          padding: var(--edge-gap-half);
          padding-left: var(--edge-gap-double);
        }

        .edge-avatar {
          display: inherit;
          position: relative;
        }

        .edge-avatar-image {
          border-radius: 8px;
          height: 36px;
          object-fit: cover;
          width: 36px;
        }

        .edge-avatar.big .edge-avatar-image {
          height: 80px;
          width: 80px;
        }
        .edge-avatar.big.has-status:after {
          height: 12px;
          transform: translate(1px, -1px);
          width: 12px;
        }

        .edge-avatar.medium .edge-avatar-image {
          height: 48px;
          width: 48px;
        }

        .edge-avatar.small .edge-avatar-image {
          height: 32px;
          width: 32px;
        }

        .edge-avatar.has-status:after {
          border: 2px solid var(--edge-background);
          border-radius: 50%;
          box-sizing: content-box;
          content: '';
          height: 8px;
          position: absolute;
          top: 0;
          right: 0;
          width: 8px;
        }

        .edge-avatar.has-status.available:after {
          background-color: var(--edge-cyan-dark);
        }

        /* Avatar User*/

        .edge-avatar-user {
          align-items: center;
          display: flex;
        }

        .edge-avatar-user .edge-avatar-user-info {
          display: flex;
          flex-flow: column;
          margin-left: var(--edge-gap-half);
        }

        .edge-user-name {
          font-size: 12px;
        }

        .edge-user-alias {
          font-size: 12px;
        }
      `}</style>
    </>
  )
}

export default withEdgeTheme(MyApp)
