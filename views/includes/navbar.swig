<nav id="jsdoc-navbar" role="navigation" {{ cssClass('!jsdoc-navbar') }}>
    <div id="jsdoc-navbar-container" {{ cssClass('jsdoc-navbar-container') }}>
        <div id="jsdoc-navbar-content" {{ cssClass('jsdoc-navbar-content') }}>
            {% spaceless %}
                {% if package %}
                    {% set headingText = package.name || '' %}
                    {% if package.name && package.version %}
                        {% set headingText = headingText + ' ' + package.version %}
                    {% endif %}
                    {# TODO: make this configurable, perhaps by adding a `linkHref` helper and
                    building the link that way #}
                    {% set headingClass = 'jsdoc-navbar-package-name' %}
                    {{ link('index', headingText, headingClass)|safe }}
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
