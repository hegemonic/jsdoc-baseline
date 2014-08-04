<!doctype html>
<html>
    {% block head %}
        <head>
            {% block meta %}
                <meta name="generator" content="JSDoc {{ jsdocVersion() }}">
                <meta charset="{{ config('encoding') }}">
                {# TODO: anything else to include by default? Maybe viewport scale? #}
            {% endblock %}
            {% block title %}
                <title>
                    {% set context = { pageCategory: pageCategory, pageTitle: pageTitle } %}
                    {% include 'includes/pagetitle.swig' with context only %}
                </title>
            {% endblock %}
            {% block css %}
                {# TODO: https://github.com/typekit/webfontloader #}
                <link rel="stylesheet" href="http://brick.a.ssl.fastly.net/Karla:400,400i,700,700i" type="text/css">
                <link rel="stylesheet" href="http://brick.a.ssl.fastly.net/Noto+Serif:400,400i,700,700i" type="text/css">
                <link rel="stylesheet" href="http://brick.a.ssl.fastly.net/Inconsolata:500" type="text/css">
                {# TODO: replace with relativePath tag #}
                <link href="css/baseline.css" rel="stylesheet">
            {% endblock %}
        </head>
    {% endblock %}
    {% block body %}
        {# TODO: move to script file #}
        <body onload="prettyPrint()">
            {% block body-navbar %}
                {% set context = {package: package} %}
                {% include 'includes/navbar.swig' with context only %}
            {% endblock %}

            {% block body-container %}
                <div id="jsdoc-body-container">
                    {% block content %}
                        <div id="jsdoc-content" role="document">
                            {% block content-container %}
                                <div id="jsdoc-content-container">
                                    {% block banner %}
                                        <div id="jsdoc-banner" role="banner">
                                            {% block banner-content %}
                                                {#
                                                    Override the <code>banner-content</code> block
                                                    to add content.
                                                #}
                                            {% endblock %}
                                        </div>
                                    {% endblock %}
                                    {% block main %}
                                        <div id="jsdoc-main" role="main">
                                            {% block main-content %}
                                                {#
                                                    Override the <code>main-content</code> block
                                                    to add content.
                                                #}
                                            {% endblock %}
                                        </div>
                                    {% endblock %}
                                </div>
                            {% endblock %}
                            {% block toc-nav %}
                                {# Added on page load #}
                                <nav id="jsdoc-toc-nav" role="navigation"></nav>
                            {% endblock %}
                        </div>
                    {% endblock %}
                </div>
            {% endblock %}

            {% block footer %}
                <footer id="jsdoc-footer" {{ cssClass('!jsdoc-footer') }}>
                    {% block footer-container %}
                        <div id="jsdoc-footer-container">
                            {% block footer-content %}
                                <p>
                                    {{ translate('generatedBy', {
                                        version: jsdocVersion(),
                                        date: localizedDate()
                                    }) }}
                                </p>
                            {% endblock %}
                        </div>
                    {% endblock %}
                </footer>
            {% endblock %}


            {% block body-scripts %}
                {# TODO: combine JS for JSDoc-only files #}
                {# TODO: fix up path relative to current output directory #}
                <script src="scripts/jquery.min.js"></script>
                <script src="scripts/jquery.cookie.js"></script>
                <script src="scripts/tree.jquery.js"></script>
                <script src="scripts/prettify.js"></script>
                <script src="scripts/jsdoc-toc.js"></script>
                <script src="scripts/linenumber.js"></script>
            {% endblock %}
        </body>
    {% endblock %}
</html>
