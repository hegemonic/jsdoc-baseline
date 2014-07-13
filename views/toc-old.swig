{%
    set tocSections = [
        { category: CATEGORIES.MODULES, title: 'Modules' },
        { category: CATEGORIES.NAMESPACES, title: 'Namespaces' },
        { category: CATEGORIES.CLASSES, title: 'Classes' },
        { category: CATEGORIES.MIXINS, title: 'Mixins' },
        { category: CATEGORIES.EVENTS, title: 'Events' },
        { category: CATEGORIES.EXTERNALS, title: 'Externals' },
        { category: CATEGORIES.TUTORIALS, title: 'Tutorials' }
    ]
%}
{% set globalsTitle = 'Globals' %}

{% macro tocCategory(title, items) %}
    {% set seen = {} %}
    {% if items && items.length %}
        {# TODO: use cssclass() #}
        <li class="nav-link">{{ title }}</li>
        {% for item in items %}
            {% set longname = item.longname %}
            {% if !hasOwnProp(seen, longname) %}
                {# TODO: use cssclass() #}
                <li class="nav-link">{{ linkto(longname, item.name) }}</li>
                {% set seen[longname] = true %}
            {% endif %}
        {% endfor %}
    {% endif %}
{% endmacro %}

{# TODO: plenty of room for improvement here #}
{% block toc %}
    {# TODO: use cssclass() #}
    <ul class="nav-menu">
        {% for section in tocSections %}
            {% set currentSymbols = symbols.get(section.category) %}
            {{ tocCategory(section.title, currentSymbols) }}
        {% endfor %}
        {% if globals && globals.hasDoclets() %}
            {# TODO: use cssclass() #}
            <li class="nav-link">{{ linkto('global', globalsTitle) }}</li>
        {% endif %}
    </ul>
{% endblock %}
