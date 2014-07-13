{% block navbar %}
    <nav id="jsdoc-navbar" role="navigation" {{ cssclass('jsdoc-navbar') }}>
        {% block navbar-container %}
            <div id="jsdoc-navbar-container" {{ cssclass('jsdoc-navbar-container') }}>
                {% block navbar-content %}
                    <div id="jsdoc-navbar-content" {{ cssclass('jsdoc-navbar-content') }}>
                        {% spaceless %}
                            {% if package %}
                                {# TODO: fix href #}
                                <a {{ cssclass('jsdoc-navbar-package-name') }} href="#">
                                    {{ package.name || '' }}
                                    {% if package.name && package.version %}
                                        {{ ' ' + package.version }}
                                    {% endif %}
                                </a>
                            {% endif %}
                            {#
                                TODO:
                                  - search
                                  - breadcrumbs
                            #}
                        {% endspaceless %}
                    </div>
                {% endblock %}
            </div>
        {% endblock %}
    </nav>
{% endblock %}
