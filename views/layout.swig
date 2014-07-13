<!doctype html>
<html>
    {% block head %}
        <head>
            {% block meta %}
                {# TODO: include anything by default? viewport scale? #}
            {% endblock %}
            {% block title %}
                <title>{{ pageTitle }}</title>
            {% endblock %}
            {% block css %}
                {# TODO: https://github.com/typekit/webfontloader #}
                <link rel="stylesheet" href="http://brick.a.ssl.fastly.net/Lato:400,400i,500,500i,600,600i,700,700i/Inconsolata:500">
                <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
                <!--
                <link href='http://fonts.googleapis.com/css?family=Roboto+Condensed:400,700' rel='stylesheet' type='text/css'>
                <link href='http://fonts.googleapis.com/css?family=Crimson+Text:400,700,600' rel='stylesheet' type='text/css'>
                <link href='http://fonts.googleapis.com/css?family=Asap:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
                -->
                {# TODO: replace with relativePath tag #}
                <link href="css/baseline.css" rel="stylesheet">
            {% endblock %}
        </head>
    {% endblock %}
    {% block body %}
        <body>
            {% block body-navbar %}
                {% set context = {package: package} %}
                {% include 'includes/navbar.swig' with context %}
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

                    {% block footer %}
                        <footer>
                            <div>
                                {# TODO company, year #}
                            </div>
                        </footer>
                    {% endblock %}
                </div>
            {% endblock %}

            {% block body-scripts %}
                {# TODO: combine/minify JS #}
                {# TODO: fix up path relative to current output directory #}
                <script src="scripts/jquery.js"></script>
                <script src="scripts/jquery.cookie.js"></script>
                <script src="scripts/tree.jquery.js"></script>
                {# TODO: why not working?? #}
                <script src="scripts/prettify/prettify.js"></script>
                {# TODO: replace with relativePath tag #}
                <script src="scripts/jsdoc-toc.js"></script>
            {% endblock %}
        </body>
    {% endblock %}
</html>
