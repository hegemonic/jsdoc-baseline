<nav id="jsdoc-navbar" role="navigation" {{ cssClass('!jsdoc-navbar') }}>
    <div id="jsdoc-navbar-container" {{ cssClass('jsdoc-navbar-container') }}>
        <div id="jsdoc-navbar-content" {{ cssClass('jsdoc-navbar-content') }}>
            {% spaceless %}
                {% if package %}
                    {# TODO: fix href #}
                    <a id="jsdoc-navbar-package-name"
                    {{ cssClass('!jsdoc-navbar-package-name') }} href="#">
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
    </div>
</nav>
