!function(){function o(n){var o,n=document.getElementById(n.replace(/^#/,""));n&&(n=n.getBoundingClientRect(),o=n.top+window.pageYOffset,setTimeout(function(){window.scrollTo(0,o-50)},5))}window.addEventListener("load",function(){var n=window.location.hash;n&&"#"!==n&&o(n),window.addEventListener("hashchange",function(){o(window.location.hash)})})}();